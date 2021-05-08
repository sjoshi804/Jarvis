// Internal Modules
import { exception } from "console";
import { EXIT } from "../../constants";

// External Modules
const inquirer = require('inquirer');
import { v4 as uuid } from 'uuid';
inquirer.registerPrompt("date", require("inquirer-date-prompt"));

class Task
{
    // Member Variables
    public points: number | undefined;
    public title: string | undefined;
    public description: string | undefined;
    public due_date: Date | undefined;   
    public completed: boolean | undefined; 

    // Constructor
    public constructor(title: string, description: string, points: number, due_date: Date | undefined)
    {
        this.title = title;
        this.description = description;
        this.points = points;
        this.due_date = due_date;
    }

    // CLI Functions
    public static cli_create_or_select_tasks(): Array<string> {
        const questions = 
        [
            {
                type: 'list',
                name: 'choice',
                message: 'Add Task By: ',
                choices: [
                    Task.CREATE_NEW_TASK,
                    Task.ADD_TASK_FROM_BACKLOG,
                    EXIT
                ],
            }
        ]

        var new_task_id;
        inquirer.prompt(questions).then(
            (answers: { choice: any; }) =>
            {
                switch (answers.choice)
                {
                    case Task.CREATE_NEW_TASK:
                        new_task_id = Task.cli_create_new_task();
                        break;
                    case Task.ADD_TASK_FROM_BACKLOG:
                        new_task_id = undefined;
                        break; 
                    case EXIT:
                        break;
                    default:
                        throw exception("Invalid choice.")
                }
            }
        )
        
        // Add new task to list of tasks and recurse
        var taskIdList = new Array<string>();
        if (new_task_id != undefined)
        {
            taskIdList.push(new_task_id)
            return taskIdList.concat(Task.cli_create_or_select_tasks())
        }
        // Base case - no more tasks 
        else 
        {
            return taskIdList;
        }
    }

    public static cli_create_new_task(): string
    {
        const questions = 
        [
            {
                type: 'input',
                name: 'title',
                message: 'Task Title: '
            },
            {
                type: 'input',
                name: 'description',
                message: 'Description: '
            },
            {
                type: 'number',
                name: 'points',
                message: "Points: "
            },
            {
                type: 'confirm',
                name: 'bool_skip_due_date',
                message: "Skip Due Date?"
            },
            {
                type: 'date',
                name: 'due_date',
                message: "Due Date",
                when: (answers: { bool_skip_due_date: any; }) => !answers.bool_skip_due_date
            }
        ]

        var new_task_id = "";
        inquirer
        .prompt(questions)
        .then(
            (answers: any) =>
            {
                // Create New Task Id
                new_task_id = uuid()
                
                // Create New Task Object
                var new_task = new Task(
                    answers.title,
                    answers.description,
                    answers.points,
                    answers.due_date
                );
                console.log(new_task_id, answers);

                // Save New Task in Database
                

            }
        );
        
        return new_task_id;
    }

    // Constants
    public static CREATE_NEW_TASK = "Create New Task";
    public static ADD_TASK_FROM_BACKLOG = "Add Task From Backlog";
}

export { Task }
// Internal Modules
import { exception } from "console";
import { EXIT } from "../../constants";

// External Modules
const inquirer = require('inquirer');
import { v4 as uuid } from 'uuid';
import { DBClient } from "../../dbClient";
inquirer.registerPrompt("date", require("inquirer-date-prompt"));

class Task
{
    // Member Variables
    public _id: string;
    public points: number;
    public title: string;
    public description: string;
    public due_date: Date | undefined;   
    public completed: boolean; 

    // Constructor
    public constructor(title: string, description: string, points: number, due_date: Date | undefined)
    {
        this._id = uuid();
        this.title = title;
        this.description = description;
        this.points = points;
        this.due_date = due_date;
        this.completed = false;
    }

    // CLI Functions
    public static async cli_create_or_select_tasks() {
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

        var task_ids = new Array<string>();
        var new_task_id;
        do
        {
            new_task_id = undefined;
            await inquirer.prompt(questions).then(
                async (answers: { choice: any; }) =>
                {
                    switch (answers.choice)
                    {
                        case Task.CREATE_NEW_TASK:
                            new_task_id = await Task.cli_create_new_task();
                            return;
                        case Task.ADD_TASK_FROM_BACKLOG:
                            new_task_id = undefined;
                            return;
                        case EXIT:
                            return;
                        default:
                            throw exception("Invalid choice.")
                    }
                }
            )
            
            // Add new task to list of tasks
            if (new_task_id != undefined)
            {
                task_ids.push(new_task_id) 
            }
        }
        while (new_task_id != undefined)
        
        return task_ids;
    }

    public static async cli_create_new_task()
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

        
        return inquirer
        .prompt(questions)
        .then(
            async (answers: any) =>
            {
                // Create New Task Object
                var new_task = new Task(
                    answers.title,
                    answers.description,
                    answers.points,
                    answers.due_date
                );

                // Save New Task in Database
                await DBClient.db.collection(Task.COLLECTION_NAME).insertOne(new_task);

                // Return task id
                return new_task._id;
            }
        );
    }

    // Constants
    public static COLLECTION_NAME = "task";
    public static CREATE_NEW_TASK = "Create New Task";
    public static ADD_TASK_FROM_BACKLOG = "Add Task From Backlog";
}

export { Task }
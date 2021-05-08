// Internal Modules
import { EXIT } from "../../constants";
import { Util } from "../../util"

// External Modules
import { v4 as uuid } from 'uuid';
import { exception } from "console";
import { DBClient } from "../../dbClient";
const inquirer = require('inquirer');
inquirer.registerPrompt("date", require("inquirer-date-prompt"));
const Table = require('cli-table');

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

    // DB Functions
    public static async get_backlog()
    {
        return await DBClient.db.collection(Task.COLLECTION_NAME).find({completed: false}).toArray();
    }

    // CLI Functions
    public static async cli_create_or_select_tasks() {
        const questions = 
        [
            {
                type: 'list',
                name: 'choice',
                message: 'Add Task By:',
                choices: [
                    Task.CREATE_NEW_TASK,
                    Task.ADD_TASK_FROM_BACKLOG,
                    EXIT
                ],
            }
        ]

        var task_ids = new Array<string>();
        var new_task_ids;
        do
        {
            new_task_ids = undefined;
            await inquirer.prompt(questions).then(
                async (answers: { choice: any; }) =>
                {
                    switch (answers.choice)
                    {
                        case Task.CREATE_NEW_TASK:
                            new_task_ids = await Task.cli_create_new_task();
                            return;
                        case Task.ADD_TASK_FROM_BACKLOG:
                            new_task_ids = await Task.cli_select_from_backlog();
                            return;
                        case EXIT:
                            return;
                        default:
                            throw exception("Invalid choice.")
                    }
                }
            )
            
            // Add new task to list of tasks
            if (new_task_ids != undefined)
            {
                task_ids.concat(new_task_ids) 
            }
        }
        while (new_task_ids != undefined)
        
        return task_ids;
    }

    // Create new task using CLI and input into DB
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
            },
            {
                type: 'confirm',
                name: 'bool_task_creation_complete',
                message: "Done creating tasks?"
            }
        ]

        var new_task_ids = Array<string>();
        var task_creation_complete = false;
        while (!task_creation_complete)
        {
            task_creation_complete = await inquirer
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

                    // Push task id on to array
                    new_task_ids.push(new_task._id);

                    // Return whether or not to continue
                    return answers.bool_task_creation_complete
                }
            );
        }

        return new_task_ids;
    }
    
    public static async cli_select_from_backlog()
    {
        return this.cli_choose_tasks_from_list(await Task.get_backlog());
    }

    public static async cli_choose_tasks_from_list(task_list: any[])
    {
        var task_choices = [];
        for (var i = 0; i < task_list.length; i++)
        {
            task_choices.push(
                {
                    name: Util.short_display_task(task_list[i]),
                    value: task_list[i]._id
                }
            )
        }

        return inquirer.prompt(
            [{
                type: 'checkbox',
                message: 'Choose Tasks:',
                name: 'selected_tasks',
                choices: task_choices,
            
            }])
            .then((answers: { selected_tasks: any; }) => answers.selected_tasks)
    }

    public static async cli_view_backlog()
    {
        var task_list = await Task.get_backlog();
        Task.cli_print_task_table(task_list);
    }

    // Misc Functions
    public static cli_print_task_table(task_list: string | any[])
    {
        // Instantiate Table
        var table = new Table({
            head: ['Title', 'Points', 'Due Date', 'Description']
        , colWidths: [25, 10, 15, 50]
        });

        // Create table for tasks
        for (var i = 0; i < task_list.length; i++) 
        {
            const due_date = task_list[i].due_date == undefined ? "N/A" : Util.formatDate(task_list[i].due_date);
            var task_row = [task_list[i].title, task_list[i].points, due_date, task_list[i].description];
            table.push(task_row);
        }

        // Print Table
        console.log(table.toString());
    }

    // Constants
    public static COLLECTION_NAME = "task";
    public static CREATE_NEW_TASK = "Create New Task";
    public static ADD_TASK_FROM_BACKLOG = "Add Task From Backlog";
}

export { Task }
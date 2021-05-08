// Internal Modules
import { EXIT } from "../../constants";
import { Util } from "../../util"

// External Modules
import { v4 as uuid } from 'uuid';
import { exception } from "console";
import { DBClient } from "../../dbClient";
import chalk from "chalk";
import { DailyPlan } from "./DailyPlan";
import { globalAgent } from "http";
import { Goal } from "./goal";
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
    public goal_id: string | undefined;

    // Constructor
    public constructor(title: string, description: string, points: number, due_date: Date | undefined, goal_id: string | undefined)
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

    public static async delete_tasks(task_ids: any)
    {
        await DBClient.db.collection(DailyPlan.COLLECTION_NAME).updateMany(
            {},
            {
                $pull: { task_ids: { $in: task_ids } } 
            }
        )
        return DBClient.db.collection(Task.COLLECTION_NAME).deleteMany(
            {
                _id: { $in: task_ids } 
            }
        );
    }

    public static async postpone_tasks(task_ids: any, new_due_date: Date)
    {
        return DBClient.db.collection(Task.COLLECTION_NAME).updateMany(
            {
                _id: { $in: task_ids }
            },
            {
                $set: { due_date: new_due_date }
            }
        )   
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
        while (true)
        {
            var new_task_ids = await inquirer.prompt(questions).then(
                async (answers: { choice: any; }) =>
                {
                    switch (answers.choice)
                    {
                        case Task.CREATE_NEW_TASK:
                            return Task.cli_create_new_task();
                        case Task.ADD_TASK_FROM_BACKLOG:
                            return Task.cli_select_from_backlog();
                        case EXIT:
                            return undefined;
                        default:
                            throw exception("Invalid choice.")
                    }
                }
            )
            
            
            // Add new task to list of tasks
            if (new_task_ids != undefined)
            {
                task_ids = task_ids.concat(new_task_ids) 
            }
            else
            {
                break;
            }
        }

        return task_ids;
    }

    // Create new task using CLI and input into DB
    public static async cli_create_new_task()
    {
        const goals = await Goal.get_all_goals()
        var goal_choices = []
        for (var i = 0; i < goals.length; i++)
        {   
            goal_choices.push(
                {
                    name: goals[i].title,
                    value: goals[i]._id
                }
            )
        }
        goal_choices.push({
            name: "None",
            value: null
        })

        const questions = 
        [
            {
                type: 'input',
                name: 'title',
                message: 'Task Title:'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Description:'
            },
            {
                type: 'number',
                name: 'points',
                message: "Points:"
            },
            {
                type: 'confirm',
                name: 'bool_due_date',
                message: "Has Due Date?"
            },
            {
                type: 'date',
                name: 'due_date',
                message: "Due Date:",
                when: (answers: { bool_due_date: any; }) => answers.bool_due_date
            },
            {
                type: 'list',
                name: 'goal_id',
                message: 'Goal:',
                choices: goal_choices
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
                        answers.due_date,
                        answers.goal_id
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

    // Returns list of task ids chosen
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
    public static cli_print_task_table(task_list: string | any[], completion_stats = false)
    {
        // Instantiate Table
        var table = new Table({
            head: ['Title', 'Points', 'Due Date', 'Description']
        , colWidths: [25, 10, 15, 50]
        });

        var points_total = 0;
        var points_completed = 0;
        // Create table for tasks
        for (var i = 0; i < task_list.length; i++) 
        {
            const due_date = task_list[i].due_date == undefined ? "N/A" : Util.formatDate(task_list[i].due_date);
            var task_row = [task_list[i].title, task_list[i].points, due_date, task_list[i].description];
            
            // Status based color formatting
            if (task_list[i].due_date != null && task_list[i].due_date < (new Date()))
            {
                task_row.forEach(elem => chalk.red(elem))
            }
            else if (task_list[i].completed == true)
            {
                task_row.forEach(elem => chalk.green(elem))
                points_completed += task_list[i].points;
            }

            points_total = task_list[i].points;
            table.push(task_row);
        }

        // Print Table
        console.log(table.toString());

        // Completion stats
        if (completion_stats)
        {
            const completed_percentage = points_completed / points_total * 100
            if (completed_percentage == 100)
            {
                console.log(chalk.green("Completion: " + completed_percentage.toString() + "%"))
            }
            else if (completed_percentage > 50)
            {
                console.log(chalk.yellow("Completion: " + completed_percentage.toString() + "%"))
            }
            else 
            {
                console.log(chalk.red("Completion: " + completed_percentage.toString() + "%"))
            }
            return completed_percentage;
        }
    }

    public static async cli_delete_tasks()
    {
        const task_ids = await Task.cli_select_from_backlog();
        return Task.delete_tasks(task_ids);
    }

    public static async cli_postpone_tasks()
    {
        const task_ids = await Task.cli_select_from_backlog();
        return inquirer.prompt(
            [{
                type: 'date',
                name: 'new_due_date',
                message: "New Due Date",
            }])
            .then(
                async (answers: { new_due_date: any; }) =>
                {
                    return Task.postpone_tasks(task_ids, answers.new_due_date)
                }
            );
    }

    // Constants
    public static COLLECTION_NAME = "task";
    public static CREATE_NEW_TASK = "Create New Task";
    public static ADD_TASK_FROM_BACKLOG = "Add Task From Backlog";
}

export { Task }
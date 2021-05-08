// Internal Modules
import { Task } from "./task";
import { Util } from "../../util"

// External Modules
import {v4 as uuid } from 'uuid';
import { DBClient } from "../../dbClient";
const inquirer = require('inquirer');
inquirer.registerPrompt("date", require("inquirer-date-prompt"));

class DailyPlan
{
    // Member Variables
    public _id: string;
    public date: Date;
    public task_ids: Array<string>;
    public review: string | undefined;

    // Constructor
    public constructor(date: Date, task_ids: Array<string>)
    {
        this._id = uuid();
        this.date = date;
        this.task_ids = task_ids;
    }

    // DB Functions
    public static async get_tasks_for_day(date: Date)
    {
        const date_bounds = Util.get_date_bounds(date);
        const day_plan = await DBClient.db.collection(DailyPlan.COLLECTION_NAME).findOne(
            {
                date: {
                    "$gte": date_bounds[0],
                    "$lt": date_bounds[1]
                }
            })
        const task_list = await DBClient.db.collection(Task.COLLECTION_NAME).find({"_id" : {"$in" : day_plan.task_ids}}).toArray();
        return task_list;
    }

    public static async does_plan_exist(date: Date)
    {
        const date_bounds = Util.get_date_bounds(date);
        const count = await DBClient.db.collection(DailyPlan.COLLECTION_NAME).countDocuments(
            {
                date: {
                    "$gte": date_bounds[0],
                    "$lt": date_bounds[1]
                }
            });
        return count > 0;
    }
    

    // CLI Functions
    public static async cli_new_daily_plan_prompt()
    {
        const questions = 
        [
            {
                type: 'list',
                name: 'choice',
                message: 'Create Plan For: ',
                choices: [
                    DailyPlan.TODAY,
                    DailyPlan.TOMORROW,
                    DailyPlan.OTHER
                ],
            },
            {
                type: 'date',
                name: 'plan_date',
                message: 'Enter Date To Plan For: ',
                when: (answers: { choice: string; }) => answers.choice === DailyPlan.OTHER
            }
        ]

        return inquirer.prompt(questions)
            .then(DailyPlan.cli_new_daily_plan_response)
    }

    public static async cli_new_daily_plan_response(answers: any)
    {
        var plan_date;
        if (answers.choice == DailyPlan.TODAY)
        {
            plan_date = Util.get_today_date()
        }
        else if (answers.choice == DailyPlan.TOMORROW)
        {
            plan_date = Util.get_tomorrow_date()
        }
        else 
        {
            plan_date = answers.plan_date
        }
        
        // Check if plan already exists and if so, print error and break
        if (await DailyPlan.does_plan_exist(plan_date))
        {
            Util.print_error("Plan already exists");
            return;
        }

        // Get list of tasks for today
        var task_ids = await Task.cli_create_or_select_tasks();

        // Create Daily Plan Object with these list of tasks
        await DBClient.db.collection(DailyPlan.COLLECTION_NAME).insertOne(new DailyPlan(plan_date, task_ids));
    }

    public static async cli_view_daily_plan(date: Date)
    {
        const task_list = await DailyPlan.get_tasks_for_day(date);
        Task.cli_print_task_table(task_list)
    }

    // Constants
    public static TODAY = "Today";
    public static TOMORROW = "Tomorrow";
    public static OTHER = "Other";
    public static COLLECTION_NAME = "daily_plan";
}

export { DailyPlan }
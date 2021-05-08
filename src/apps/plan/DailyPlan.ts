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
    public static async get_tasks_for_today()
    {
        const today_plan = await DBClient.db.collection(DailyPlan.COLLECTION_NAME).findOne(
            {
                date: {
                    "$gte": Util.getTodayDate(),
                    "$lt": Util.getTomorrowDate()
                }
            })
        
        const task_list = await DBClient.db.collection(Task.COLLECTION_NAME).find({"_id" : {"$in" : today_plan.task_ids}}).toArray();
        return task_list;
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
            plan_date = Util.getTodayDate()
        }
        else if (answers.choice == DailyPlan.TOMORROW)
        {
            plan_date = Util.getTomorrowDate()
        }
        else 
        {
            plan_date = answers.plan_date
        }
        
        // Check if plan already exists and if so, print error and break
        if (DailyPlan.does_plan_exist(plan_date))
        {
            console.log("Plan already exists");
            return;
        }

        // Get list of tasks for today
        var task_ids = await Task.cli_create_or_select_tasks();

        // Create Daily Plan Object with these list of tasks
        await DBClient.db.collection(DailyPlan.COLLECTION_NAME).insertOne(new DailyPlan(plan_date, task_ids));
    }

    // Constants
    public static TODAY = "Today";
    public static TOMORROW = "Tomorrow";
    public static OTHER = "Other";
    public static COLLECTION_NAME = "daily_plan";
}

export { DailyPlan }
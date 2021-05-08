// Internal Modules
import { Task } from "./Task";

// External Modules
const inquirer = require('inquirer');
inquirer.registerPrompt("date", require("inquirer-date-prompt"));
class DailyPlan
{
    // Member Variables
    public date: Date | undefined;
    public task_ids: Array<string> | undefined;
    public review: string | undefined;

    // Constructor
    public constructor(date: Date, task_ids: Array<string>)
    {
        this.date = date;
        this.task_ids = task_ids;
    }

    // CLI Functions
    public static cli_new_daily_plan_prompt()
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

    public static cli_new_daily_plan_response(answers: any)
    {
        var plan_date;
        if (answers.choice == DailyPlan.TODAY)
        {
            plan_date = new Date()
        }
        else if (answers.choice == DailyPlan.TOMORROW)
        {
            plan_date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        }
        else 
        {
            plan_date = answers.plan_date
        }

        // Get list of tasks for today
        var task_ids = Task.cli_create_or_select_tasks();

        // Create Daily Plan Object with these list of tasks
        const newPlan = new DailyPlan(plan_date, task_ids);

        // Insert into Database

    }

    // Constants
    public static TODAY = "Today";
    public static TOMORROW = "Tomorrow";
    public static OTHER = "Other";
}

export { DailyPlan }
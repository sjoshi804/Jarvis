import { exception } from "console";

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
    public DailyPlan(date: Date, task_ids: Array<string>)
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
        console.log("Plan Date", plan_date)
    }

    // Constants
    public static TODAY = "Today";
    public static TOMORROW = "Tomorrow";
    public static OTHER = "Other";
}

export { DailyPlan }
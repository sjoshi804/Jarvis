// Internal Modules
import { INVALID_OPTION_ERROR } from "../../constants";
import { DailyPlan } from "./DailyPlan";

// External Modules
const inquirer = require("inquirer");

class PlanMenu
{
    public static prompt()
    {
        const questions = 
        {
            type: 'list',
            name: 'choice',
            message: 'What do you want to do?',
            choices: [
                PlanMenu.VIEW_TODAYS_PLAN,
                PlanMenu.NEW_DAILY_PLAN,
                PlanMenu.ADD_TASKS_TO_BACKLOG,
                PlanMenu.VIEW_TASKS_IN_BACKLOG
            ],
        }

        return inquirer.prompt(questions)
            .then(PlanMenu.response)
    }

    public static response(answers: any)
    {
        switch(answers.choice)
        {
            case PlanMenu.NEW_DAILY_PLAN:
                DailyPlan.cli_new_daily_plan_prompt();
                break;
            case PlanMenu.VIEW_TODAYS_PLAN:
                //DailyPlan.cli_view_todays_plan();
                break;
            case PlanMenu.ADD_TASKS_TO_BACKLOG:
                //Task.cli_add_to_backlog();
                break;
            case PlanMenu.VIEW_TASKS_IN_BACKLOG:
                //Task.view_tasks_in_backlog();
                break;
            default: 
                console.log(INVALID_OPTION_ERROR)
        }
    }

    // Constants
    public static MODULE_NAME = "Plan";
    public static NEW_DAILY_PLAN = "New Daily Plan";
    public static VIEW_TODAYS_PLAN = "View Today\'s Plan";
    public static ADD_TASKS_TO_BACKLOG = "Add Tasks to Backlog";
    public static VIEW_TASKS_IN_BACKLOG = "View Tasks in Backlog";
}

export { PlanMenu as PlanMenu }
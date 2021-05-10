// Internal Modules
import { DailyPlan } from "./DailyPlan";
import { INVALID_OPTION_ERROR } from "../../constants";
import { Task } from "./task";
import { Util } from "../../util";
import { Goal } from "./goal";

// External Modules
const inquirer = require("inquirer");

class PlanMenu
{
    public static async prompt()
    {
        const questions = 
        {
            type: 'list',
            name: 'choice',
            message: 'What do you want to do?',
            choices: [
                new inquirer.Separator(Util.format_separator("Week Ahead")),
                PlanMenu.VIEW_WEEK_TASKS,
                PlanMenu.VIEW_NEXT_WEEK_TASKS,
                new inquirer.Separator(Util.format_separator("Daily Plans")),
                PlanMenu.VIEW_TODAYS_PLAN,
                PlanMenu.NEW_DAILY_PLAN,
                PlanMenu.REVIEW_DAILY_PLAN,
                new inquirer.Separator(Util.format_separator("Tasks")),
                PlanMenu.ADD_TASKS_TO_BACKLOG,
                PlanMenu.VIEW_TASKS_IN_BACKLOG,
                PlanMenu.POSTPONE_TASKS,
                PlanMenu.DELETE_TASKS,
                new inquirer.Separator(Util.format_separator("Goals")),
                PlanMenu.VIEW_GOALS,
                PlanMenu.CREATE_NEW_GOAL,
                PlanMenu.DELETE_GOAL
            ],
        }

        return inquirer.prompt(questions)
            .then(PlanMenu.response)
    }

    public static async response(answers: any)
    {
        switch(answers.choice)
        {
            case PlanMenu.VIEW_WEEK_TASKS:
                await Task.cli_view_week_tasks(Util.get_today_date());
                break;
            case PlanMenu.VIEW_NEXT_WEEK_TASKS:
                await Task.cli_view_week_tasks(Util.set_to_next_week(Util.get_today_date()));
                break;
            case PlanMenu.NEW_DAILY_PLAN:
                await DailyPlan.cli_new_daily_plan_prompt();
                break;
            case PlanMenu.VIEW_TODAYS_PLAN:
                if (await DailyPlan.does_plan_exist(Util.get_today_date()))
                {
                    await DailyPlan.cli_view_and_edit_daily_plan(Util.get_today_date())
                }
                else
                {
                    Util.print_error("Plan doesn't exist");
                }
                break;
            case PlanMenu.REVIEW_DAILY_PLAN:
                await DailyPlan.cli_add_review();
                break;
            case PlanMenu.ADD_TASKS_TO_BACKLOG:
                await Task.cli_create_new_task();
                break;
            case PlanMenu.VIEW_TASKS_IN_BACKLOG:
                await Task.cli_view_backlog();
                break;
            case PlanMenu.POSTPONE_TASKS:
                await Task.cli_postpone_tasks();
                break;
            case PlanMenu.DELETE_TASKS:
                await Task.cli_delete_tasks();
                break;
            case PlanMenu.CREATE_NEW_GOAL:
                await Goal.cli_create_new_goal();
                await Goal.cli_view_goals();
                break;
            case PlanMenu.VIEW_GOALS:
                await Goal.cli_view_goals(true);
                break;
            case PlanMenu.DELETE_GOAL:
                await Goal.cli_delete_goal();
                break;
            default: 
                Util.print_error(INVALID_OPTION_ERROR)
        }
    }

    // Constants
    public static MODULE_NAME = "Plan";
    public static NEW_DAILY_PLAN = "New Daily Plan";
    public static VIEW_TODAYS_PLAN = "View Today\'s Plan";
    public static ADD_TASKS_TO_BACKLOG = "Add Tasks to Backlog";
    public static VIEW_TASKS_IN_BACKLOG = "View Tasks in Backlog";
    public static DELETE_TASKS = "Delete Tasks";
    public static POSTPONE_TASKS = "Postpone Tasks";
    public static CREATE_NEW_GOAL = "Create New Goal";
    public static VIEW_GOALS = "View Goals";
    public static DELETE_GOAL = "Delete Goal";
    public static REVIEW_DAILY_PLAN = "Review Daily Plan"
    public static VIEW_WEEK_TASKS = "View Week\'s Tasks"
    public static VIEW_NEXT_WEEK_TASKS = "View Next Week\'s Tasks"
}

export { PlanMenu as PlanMenu }
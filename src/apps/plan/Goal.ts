// Internal Modules
import { DBClient } from "../../dbClient";
import { Task } from "./task";
import { Util } from "../../util";

// External Modules
const chalk = require('chalk');
const Table = require('cli-table');
const inquirer = require('inquirer');
inquirer.registerPrompt("date", require("inquirer-date-prompt"));
import { v4 as uuid } from 'uuid';

class Goal
{
    // Member Variables
    public _id: string;
    public title: string;
    public description: string;
    public achieve_by_date: Date;
    public completed: boolean;

    // Constructor
    public constructor(title: string, description: string, achieve_by_date: Date)
    {
        this._id = uuid();
        this.title = title;
        this.description = description;
        this.achieve_by_date = achieve_by_date;
        this.completed = false;
    }

    // DB Functions
    public static async create_new_goal(goal: Goal)
    {
        return DBClient.db.collection(Goal.COLLECTION_NAME).insertOne(goal);
    }

    public static async delete_goal(goal: string)
    {
        await DBClient.db.collection(Task.COLLECTION_NAME).updateMany(
            {},
            {
                $set: { goal_id: null}
            }
        )
        return DBClient.db.collection(Goal.COLLECTION_NAME).deleteOne(
            {
                _id: goal
            }
        );
    }

    public static async get_all_goals()
    {
        return DBClient.db.collection(Goal.COLLECTION_NAME).find({}).toArray();
    }

    public static async mark_goal_completed(goal_id: string)
    {
        return DBClient.db.collection(Goal.COLLECTION_NAME).updateOne(
            {
                _id: goal_id
            },
            {
                $set: {completed: true}
            }
        )
    }

    // CLI Functions
    public static async cli_create_new_goal()
    {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Title:'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Description:'
            },
            {
                type: 'date',
                name: 'achieve_by_date',
                message: 'Achieve By:'
            }
        ]).then(
            async (answers: { title: string; description: string; achieve_by_date: Date; }) =>
            {
                return Goal.create_new_goal(new Goal(answers.title, answers.description, answers.achieve_by_date))
            }
        )
    }

    public static async cli_delete_goal()
    {
        const goal_id = await Goal.cli_select_goal();
        return Goal.delete_goal(goal_id)
    }

    public static async cli_select_goal()
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

        return inquirer.prompt([{
            type: 'list',
            name: 'goal_id',
            message: 'Choose Goal:',
            choices: goal_choices
        }])
        .then(async (answers: { goal_id: any; }) =>
            answers.goal_id
        )
    }

    public static async cli_view_goals(full=false)
    {
        const goal_list = await Goal.get_all_goals();

        // Print Header
        console.log(chalk.bold(chalk.inverse("\n================= Goals =================\n")));

        // Print goal
        for (var i = 0; i < goal_list.length; i++) 
        {
            console.log(chalk.bold(goal_list[i].title));
            console.log(chalk.bold(Util.text_format_date(goal_list[i].achieve_by_date)));
            if (full)
            {
                console.log(goal_list[i].description);
            }
            console.log("\n");
        }
    }

    // Constants
    public static COLLECTION_NAME = "goal"
}

export { Goal }
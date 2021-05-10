#!/usr/bin/env node

// External Modules
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require("inquirer");
const { Command } = require('commander');

// Internal Modules
import { DBClient } from "./dbClient";
import { INVALID_OPTION_ERROR } from "./constants";
import { PlanMenu } from "./apps/plan/planMenu";
import { Util } from "./util";
import { Goal } from "./apps/plan/goal";


// Splash Screen
clear();
console.log(
  chalk.red(
    figlet.textSync('JARVIS', { horizontalLayout: 'full' })
  )
);



// Define main menu
const main_menu = async () => 
{
  // Connect to database
  await DBClient.connect();

  // Display Goals
  await Goal.cli_view_goals();

  // Get Main Menu 
  await inquirer.prompt(
    [{
      type: 'list',
      name: 'choice',
      message: 'Choose a module',
      choices: [
        PlanMenu.MODULE_NAME,
        'Idea'
      ],
    }]).then(async (answers: any) =>
    {
      if (answers.choice == PlanMenu.MODULE_NAME)
      {
        await PlanMenu.prompt()
      }
      else 
      {
        Util.print_error(INVALID_OPTION_ERROR)
      }
    })

  // Close DB Connection
  DBClient.close();
};

// Create Cli Object
const cli = new Command();
cli
  .version('1.0.0')
  .description("CLI Interface for Virtual Assistant Jarvis")
  .action(main_menu)

cli.parse(process.argv)
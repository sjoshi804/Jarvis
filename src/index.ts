#!/usr/bin/env node

// External Modules
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require("inquirer");
const { Command } = require('commander');

// Internal Modules
import { PlanMenu } from "./apps/plan/planMenu";
import { INVALID_OPTION_ERROR } from "./constants";


// Splash Screen
clear();
console.log(
  chalk.red(
    figlet.textSync('JARVIS', { horizontalLayout: 'full' })
  )
);

// Define main menu
const main_menu = () => 
{
  inquirer.prompt(
    [{
      type: 'list',
      name: 'choice',
      message: 'Choose a module',
      choices: [
        PlanMenu.MODULE_NAME,
        'Idea'
      ],
    }]).then((answers: any) =>
    {
      if (answers.choice == PlanMenu.MODULE_NAME)
      {
        PlanMenu.prompt()
      }
      else 
      {
        console.log(INVALID_OPTION_ERROR)
      }
    })
};

// Create Cli Object
const cli = new Command();
cli
  .version('1.0')
  .description("CLI Interface for Virtual Assistant Jarvis")
  .action(main_menu)

cli.parse(process.argv)
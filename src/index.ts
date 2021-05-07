#!/usr/bin/env node

// External Modules
const chalk = require('chalk');
const chalk_animation = require('chalk-animation');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const cli = require('commander');

// Splash Screen
clear();
chalk_animation.pulse(
    figlet.textSync('JARVIS', { horizontalLayout: 'full' })
);

// Define commands
cli
  .version('1.0')
  .description("CLI Interface for Virtual Assistant Jarvis")
  .parse(process.argv);





#!/usr/bin/env node
"use strict";
// External Modules
var chalk = require('chalk');
var chalk_animation = require('chalk-animation');
var clear = require('clear');
var figlet = require('figlet');
var path = require('path');
var cli = require('commander');
// Splash Screen
clear();
console.log(chalk_animation.pulse(figlet.textSync('JARVIS', { horizontalLayout: 'full' })));
// Define commands
cli
    .version('1.0')
    .description("CLI Interface for Virtual Assistant Jarvis")
    .parse(process.argv);

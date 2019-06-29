#!/bin/node

import { addCommand, run, runCommand } from './core-functions';

addCommand('all', () => {
    console.log('Hello, world!');
});

addCommand('test', args => {
    runCommand('all');
    console.log('Test command');
});

run();

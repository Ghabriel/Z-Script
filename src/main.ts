#!/bin/node

import { addCommand, run, runCommand } from './core-functions';
import { hasFlag, parseArgs } from './flags';

addCommand('all', () => {
    console.log('Hello, world!');
});

addCommand('test', args => {
    runCommand('test2', ['a', 'b', ...args]);
    console.log('[TEST]', args);
});

addCommand('test2', args => {
    console.log('[TEST2]', args);
});

addCommand('test3', args => {
    if (hasFlag(args, '--uppercase')) {
        console.log('HELLO, WORLD!');
    } else if (hasFlag(args, '--lowercase')) {
        console.log('hello, world!');
    } else {
        console.log('Hello, world!');
    }
});

addCommand('test4', args => {
    const parsedArgs = parseArgs(args, {
        '-o': true,
        '-v': false,
    });

    console.log(parsedArgs);
});

run();

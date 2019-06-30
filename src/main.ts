#!/bin/node

import { addCommand, run, runCommand } from './core-functions';
import { parseArgs } from './flags/parse-args';

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
    if (args.includes('--uppercase')) {
        console.log('HELLO, WORLD!');
    } else if (args.includes('--lowercase')) {
        console.log('hello, world!');
    } else {
        console.log('Hello, world!');
    }
});

addCommand('test4', args => {
    const parsedArgs = parseArgs(args, {
        '-o': true,
        '--output': true,
        '-v': false,
        '-t': false,
    });

    const test = parsedArgs.mergeFlags('-o', '--output');

    console.log(parsedArgs);
    console.log(test);

    // if (parsedArgs.hasFlag('-t')) {
    //     throw Error('Non-parse error');
    // }

    // console.log(parsedArgs);
});

run();

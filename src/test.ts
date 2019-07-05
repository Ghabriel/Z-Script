#!/bin/node

import { addCommand, Color, Format, parseArgs, run, runCommand, Shell } from '.';

addCommand('all', () => {
    console.log('Hello, world!');
});

addCommand('flags', args => {
    // Commands can run other commands with given arguments.
    runCommand('example:flags', [
        'a', '-o', 'b', '-v', '--output', 'c', 'd'
    ])
});

addCommand('example:flags', args => {
    // -o and --output expect parameters,
    // -v and --verbose do not.
    const parsedArgs = parseArgs(args, {
        '-o': true,
        '--output': true,
        '-v': false,
        '--verbose': false,
    }).mergeFlags('-o', '--output') // -o and --output are equivalent
       .mergeFlags('-v', '--verbose'); // -v and --verbose are equivalent

    console.log(`getArgs() =`, parsedArgs.getArgs());
    console.log(`getFlagArgs('-o') =`, parsedArgs.getFlagArgs('-o'));
    console.log(`getFlagCount('-v') =`, parsedArgs.getFlagCount('-v'));
    console.log(`hasFlag('-v') =`, parsedArgs.hasFlag('-v'));
});

addCommand('formatting', args => {
    console.log('plain');
    Format.foreground.set(Color.Red);
    console.log('with foreground');
    Format.background.set(Color.LightGray);
    console.log('with background');
    Format.bold.set();
    console.log('with bold');
    Format.underline.set();
    console.log('with underline');

    Format.background.reset();
    console.log('without background');
    Format.foreground.reset();
    console.log('without foreground');

    Format.foreground.set(Color.Black);
    Format.background.set(Color.LightGray);
    console.log('with other colors');
    Format.reset();
    console.log('plain');
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

addCommand('test5', args => {
    Format.foreground.set(Color.Blue);
    Format.background.set(Color.White);
    Format.underline.set();
    runCommand('all');
});

addCommand('example-shell', async args => {
    const baseModTime = await Shell.getModificationTime('build');
    const recursiveModTime = await Shell.getRecursiveModificationTime('build');
    console.log(baseModTime, recursiveModTime);
});

addCommand('example-sync-shell', async args => {
    const fileExists = Shell.fileExists('package.json');
    console.log('Test');
    console.log('Exists:', fileExists);
});

run();

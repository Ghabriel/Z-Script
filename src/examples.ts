#!/bin/node

import { addCommand, Color, exec, Format, Git, parseArgs, run, runCommand, Shell } from '.';

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
    Format.apply(Format.foreground(Color.Red));
    console.log('with foreground');
    Format.apply(Format.background(Color.LightGray));
    console.log('with background');
    Format.apply(Format.bold());
    console.log('with bold');
    Format.apply(Format.underline());
    console.log('with underline');

    Format.apply(Format.background(Color.Default));
    console.log('without background');
    Format.apply(Format.foreground(Color.Default));
    console.log('without foreground');

    Format.apply(Format.foreground(Color.Black));
    Format.apply(Format.background(Color.LightGray));
    console.log('with other colors');
    Format.apply(Format.reset());
    console.log('plain');
});

addCommand('shell', args => {
    // Arbitrary commands
    exec('echo "Hello, world!"');

    // File access utilities
    const fileExists = Shell.fileExists('package.json');
    console.log('package.json ' + (fileExists ? 'exists' : 'does not exist'));

    // File operations
    Shell.createFolder('example-folder');
    Shell.copyFile('package.json', 'example-folder/package.json');
    Shell.rename('example-folder/package.json', 'example-folder/renamed-package.json');

    // File statistics
    console.log(
        'package.json was most recently editted on',
        Shell.getModificationTime('package.json')
    );

    console.log(
        'this folder was most recently editted on',
        Shell.getRecursiveModificationTime('.')
    );
});

addCommand('git', async args => {
    Format.apply(Format.foreground(Color.Yellow));

    console.log('Updating remote branch references...');
    Git.fetchRemoteBranches();

    const expiredBranches = Git.getExpiredBranches();
    if (expiredBranches.length === 0) {
        Format.apply(Format.foreground(Color.Green));
        console.log('There are no local branches whose remote counterpart has been deleted');
        return;
    }

    console.log('The following local branches no longer have a remote counterpart:');
    console.log(expiredBranches.map(b => '    ' + b).join('\n'));
    const answer = await Shell.readInput('Do you wish to erase them? [Y/n] ');
    if (answer.toLowerCase() === 'n') {
        process.exit(1);
    }

    for (const branch of expiredBranches) {
        console.log(`    git branch -d ${branch}`);
        Git.deleteLocalBranch(branch);
    }
});

addCommand('test', args => {
    // Original version
    // Format.foreground.set(Color.Red);
    // Format.bold.set();
    // process.stdout.write('Error:');
    // Format.reset();
    // console.log(' something went wrong');

    // New version #1
    // const STYLE_ERROR = Format.foreground.getSetCode(Color.Red) + Format.bold.getSetCode();
    // const STYLE_RESET = Format.getResetCode();
    // console.log(`${STYLE_ERROR}Error:${STYLE_RESET} something went wrong`);

    // New version #2 - option 1
    Format.apply(Format.foreground(Color.Yellow));
    Format.apply(Format.foreground(Color.Red) + Format.bold());
    process.stdout.write('Error:');
    Format.pop();
    console.log(' something went wrong');

    // New version #2 - option 2
    const STYLE_ERROR = Format.foreground(Color.Red) + Format.bold();
    const STYLE_RESET = Format.reset();
    console.log(`${STYLE_ERROR}Error:${STYLE_RESET} something went wrong`);
});

run();

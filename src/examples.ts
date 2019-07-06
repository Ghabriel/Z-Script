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
    Format.foreground.set(Color.Yellow);

    console.log('Updating remote branch references...');
    Git.fetchRemoteBranches();

    const expiredBranches = Git.getExpiredBranches();
    if (expiredBranches.length === 0) {
        Format.foreground.set(Color.Green);
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

run();

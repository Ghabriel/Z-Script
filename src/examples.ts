#!/bin/node

import { addCommand, Color, exec, Format, Git, parseArgs, run, runCommand, Shell } from '.';

addCommand('main', () => {
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
    console.log('plain (some terminals might glitch the background of this line)');
    console.log('plain (this one should be fine)');
});

addCommand('formatting:interpolation', args => {
    const ERROR = Format.foreground(Color.Red) + Format.bold();
    const WARNING = Format.foreground(Color.Yellow) + Format.bold();
    const NOTE = Format.foreground(Color.Blue) + Format.bold();
    const RESET = Format.reset();
    console.log('Example formatting:');
    console.log(`${ERROR}Error:${RESET} example error`);
    console.log(`${WARNING}Warning:${RESET} example warning`);
    console.log(`${NOTE}Note:${RESET} example note`);
});

addCommand('formatting:stack', args => {
    function error(text: string) {
        Format.print('Error: ', Format.foreground(Color.Red) + Format.bold());
        console.log(text);
    }

    function warning(text: string) {
        Format.print('Warning: ', Format.foreground(Color.Yellow) + Format.bold());
        console.log(text);
    }

    function note(text: string) {
        Format.print('Note: ', Format.foreground(Color.Blue) + Format.bold());
        console.log(text);
    }

    Format.apply(Format.foreground(Color.LightGreen));
    console.log('Example formatting:');
    error('example error');
    warning('example warning');
    note('example note');
    Format.pop();
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

addCommand('subcommands', (_, context) => {
    console.log('subcommands');

    // zsc subcommands
    // or zsc subcommands main
    context.addCommand('main', () => {
        console.log('subcommands::main');
    });

    // zsc subcommands a
    context.addCommand('a', (_, context) => {
        console.log('subcommands::a');

        // zsc subcommands a
        // or zsc subcommands a main
        context.addCommand('main', () => {
            console.log('subcommands::a::main');
        });

        // zsc subcommands a help
        context.addCommand('help', args => {
            console.log('subcommands::a::help', args);
        });

        context.run();
    });

    // zsc subcommands b
    context.addCommand('b', args => {
        console.log('subcommands::b', args);
    });

    context.run();
});

run();

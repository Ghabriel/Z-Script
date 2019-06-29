#!/bin/node

import { addCommand, run } from './core-functions';

addCommand('all', () => {
    console.log('Hello, world!');
});

addCommand('test', args => {
    switch (args[0]) {
        case 'up':
            console.log('[UP CODE]');
            break;

        case 'down':
            console.log('[DOWN CODE]');
            break;

        default:
            console.log(`Unknown command "${args[0]}"`);
    }
});

run();

#!/bin/node

import { addCommand, run } from './core-functions';

addCommand('all', args => {
    console.log(args);
});

run();

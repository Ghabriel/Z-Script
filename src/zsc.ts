import { Color, exec, Format, Shell } from '.';

const ZSCRIPT_FILE = 'zscript.ts';
const ZSCRIPT_JS_FILE = 'zscript.js';
const ZSCRIPT_CACHE_FILE = '.zscript_cache.js';

const FIX_FILENAME = `mv ${ZSCRIPT_JS_FILE} ${ZSCRIPT_CACHE_FILE}`;

main();

function main() {
    abortIfNoZScript();
    recompileIfNeeded();
    const args = process.argv.slice(2);
    runZScript(args);
}

function abortIfNoZScript() {
    if (!Shell.fileExists(ZSCRIPT_FILE)) {
        Format.foreground.set(Color.Red);
        Format.bold.set();
        process.stdout.write('Error: ');
        Format.reset();
        console.log(`no ${ZSCRIPT_FILE} file found.`);
        process.exit(1);
    }
}

function recompileIfNeeded() {
    if (needsRecompilation()) {
        Format.foreground.set(Color.Yellow);
        console.log('Compiling Z-Script...');
        Format.reset();
        exec(`npx tsc ${ZSCRIPT_FILE} && ${FIX_FILENAME}`);
    }
}

function needsRecompilation(): boolean {
    if (!Shell.fileExists(ZSCRIPT_CACHE_FILE)) {
        return true;
    }

    return Shell.isNewerThan(ZSCRIPT_FILE, ZSCRIPT_CACHE_FILE);
}

function runZScript(args: string[]) {
    exec(`node ${ZSCRIPT_CACHE_FILE} ${args.join(' ')}`);
}

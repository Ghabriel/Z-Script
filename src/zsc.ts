import { Color, exec, Format, Shell } from '.';

const ZSCRIPT_FILE = 'zscript.ts';
const ZSCRIPT_JS_FILE = 'zscript.js';
const ZSCRIPT_CACHE_FILE = '.zscript_cache.js';

main();

function main() {
    if (!Shell.fileExists(ZSCRIPT_FILE)) {
        Format.foreground.set(Color.Red);
        Format.bold.set();
        process.stdout.write('Error: ');
        Format.reset();
        console.log(`no ${ZSCRIPT_FILE} file found.`);
        process.exit(1);
        return;
    }

    if (needsRecompilation()) {
        Format.foreground.set(Color.Yellow);
        console.log('Compiling Z-Script...');
        Format.reset();
        exec(`npx tsc ${ZSCRIPT_FILE} && mv ${ZSCRIPT_JS_FILE} ${ZSCRIPT_CACHE_FILE}`);
    }

    const args = process.argv.slice(2);
    exec(`node ${ZSCRIPT_CACHE_FILE} ${args.join(' ')}`);
}

function needsRecompilation(): boolean {
    if (!Shell.fileExists(ZSCRIPT_CACHE_FILE)) {
        return true;
    }

    return Shell.isNewerThan(ZSCRIPT_FILE, ZSCRIPT_CACHE_FILE);
}

import { Color, exec, Format, Shell } from '.';
import { VERSION } from './core/constants';

const ZSCRIPT_FILE = 'zscript.ts';
const ZSCRIPT_JS_FILE = 'zscript.js';
const ZSCRIPT_CACHE_FILE = '.zscript_cache.js';

const FIX_FILENAME = `mv ${ZSCRIPT_JS_FILE} ${ZSCRIPT_CACHE_FILE}`;

const HELP_TEXT = `\
Z-Script - version ${VERSION}
Usage: zsc [option] [args...]
Options:
  -h, --help        Print this message and exit.
  -v, --version     Print the Z-Script's version and exit.
  -w, --watch       Watch the current directory's ${ZSCRIPT_FILE} for changes.
`;

main();

function main() {
    const args = process.argv.slice(2);

    if (args.length > 0) {
        if (args[0] === '-h' || args[0] === '--help') {
            console.log(HELP_TEXT)
            return;
        }

        if (args[0] === '-v' || args[0] === '--version') {
            console.log(`Version ${VERSION}`);
            return;
        }

        if (args[0] === '-w' || args[0] === '--watch') {
            abortIfNoZScript();
            watch();
            return;
        }
    }

    abortIfNoZScript();
    recompileIfNeeded();
    runZScript(args);
}

function watch() {
    exec(`npx tsc-watch ${ZSCRIPT_FILE} --noClear --onSuccess \"${FIX_FILENAME}\"`);
}

function abortIfNoZScript() {
    if (!Shell.fileExists(ZSCRIPT_FILE)) {
        const STYLE_ERROR = Format.foreground(Color.Red) + Format.bold();
        const STYLE_RESET = Format.reset();
        console.log(`${STYLE_ERROR}Error:${STYLE_RESET} no ${ZSCRIPT_FILE} file found.`);
        process.exit(1);
    }
}

function recompileIfNeeded() {
    if (needsRecompilation()) {
        const STYLE_COMPILING = Format.foreground(Color.Yellow);
        const STYLE_RESET = Format.reset();
        console.log(`${STYLE_COMPILING}Compiling Z-Script...${STYLE_RESET}`);
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

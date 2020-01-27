import { Color, exec, Format, Shell } from '.';
import { VERSION } from './core/constants';

/**
 * The workspace type of the current directory's Z-Script.
 * * File: a single file called "zscript.ts";
 * * Folder: a folder called "zscript" with a "main.ts" file inside.
 */
enum Workspace {
    File,
    Folder,
}

const ZSCRIPT_FILE = 'zscript.ts';
const ZSCRIPT_JS_FILE = 'zscript.js';
const ZSCRIPT_FOLDER = 'zscript';
const ZSCRIPT_FOLDER_MAIN_FILE = `${ZSCRIPT_FOLDER}/main.ts`;
const ZSCRIPT_CACHE_FILE = '.zscript_cache.js';

const HELP_TEXT = `\
Z-Script - version ${VERSION}
Usage: zsc [option] [args...]
Options:
  -h, --help        Print this message and exit.
  -v, --version     Print the Z-Script's version and exit.
  -w, --watch       Watch the current directory's Z-Script for changes.
`;

main();

function main() {
    const args = process.argv.slice(2);
    const workspace = getZScriptWorkspace();

    if (args.length > 0) {
        if (args[0] === '-h' || args[0] === '--help') {
            console.log(HELP_TEXT);
            return;
        }

        if (args[0] === '-v' || args[0] === '--version') {
            console.log(`Version ${VERSION}`);
            return;
        }

        if (args[0] === '-w' || args[0] === '--watch') {
            abortIfNoZScript(workspace);
            watch(workspace);
            return;
        }
    }

    abortIfNoZScript(workspace);
    recompileIfNeeded(workspace);
    runZScript(workspace, args);
}

function getZScriptWorkspace(): Workspace | null {
    if (Shell.fileExists(ZSCRIPT_FILE)) {
        return Workspace.File;
    }

    if (Shell.isFolder(ZSCRIPT_FOLDER)) {
        return Workspace.Folder;
    }

    return null;
}

function watch(workspace: Workspace) {
    const fixFilenameCommand = getFilenameFixCommand(workspace);
    exec(`npx tsc-watch ${ZSCRIPT_FILE} --noClear --onSuccess \"${fixFilenameCommand}\"`);
}

function getFilenameFixCommand(workspace: Workspace): string {
    switch (workspace) {
        case Workspace.File:
            return `mv ${ZSCRIPT_JS_FILE} ${ZSCRIPT_CACHE_FILE}`;
        case Workspace.Folder:
            return `mv ${ZSCRIPT_FOLDER_MAIN_FILE} ${ZSCRIPT_CACHE_FILE}`;
    }
}

function abortIfNoZScript(workspace: Workspace | null): asserts workspace is Workspace {
    if (workspace === null) {
        const STYLE_ERROR = Format.foreground(Color.Red) + Format.bold();
        const STYLE_RESET = Format.reset();
        console.log(`${STYLE_ERROR}Error:${STYLE_RESET} no ${ZSCRIPT_FILE} file found.`);
        process.exit(1);
    }
}

function recompileIfNeeded(workspace: Workspace) {
    if (needsRecompilation(workspace)) {
        recompile(workspace);
    }
}

function needsRecompilation(workspace: Workspace): boolean {
    if (!Shell.fileExists(ZSCRIPT_CACHE_FILE)) {
        return true;
    }

    switch (workspace) {
        case Workspace.File:
            return Shell.isNewerThan(ZSCRIPT_FILE, ZSCRIPT_CACHE_FILE);
        case Workspace.Folder:
            return Shell.isNewerThan(ZSCRIPT_FOLDER, ZSCRIPT_CACHE_FILE);
    }
}

function recompile(workspace: Workspace) {
    const STYLE_COMPILING = Format.foreground(Color.Yellow);
    const STYLE_RESET = Format.reset();
    console.log(`${STYLE_COMPILING}Compiling Z-Script...${STYLE_RESET}`);

    const fixFilenameCommand = getFilenameFixCommand(workspace);

    switch (workspace) {
        case Workspace.File:
            exec(`npx tsc ${ZSCRIPT_FILE} && ${fixFilenameCommand}`);
            break;
        case Workspace.Folder:
            exec(`npx tsc ${ZSCRIPT_FOLDER_MAIN_FILE} && ${fixFilenameCommand}`);
            break;
    }
}

function runZScript(workspace: Workspace, args: string[]) {
    switch (workspace) {
        case Workspace.File:
            exec(`node ${ZSCRIPT_CACHE_FILE} ${args.join(' ')}`);
            break;
        case Workspace.Folder:
            exec(`node ${ZSCRIPT_FOLDER_MAIN_FILE} ${args.join(' ')}`);
            break;
    }
}

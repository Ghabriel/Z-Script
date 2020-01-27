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
const ZSCRIPT_FOLDER = 'zscript';
const ZSCRIPT_FOLDER_MAIN_FILE = `${ZSCRIPT_FOLDER}/main.ts`;
const ZSCRIPT_OUTPUT_FOLDER = '.zscript';
const ZSCRIPT_JS_FILE = 'zscript.js';
const ZSCRIPT_EXECUTABLE_FILE = `${ZSCRIPT_OUTPUT_FOLDER}/main.js`;

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
    runZScript(args);
}

function getZScriptWorkspace(): Workspace | null {
    const fileExists = Shell.fileExists(ZSCRIPT_FILE);
    const folderExists = Shell.fileExists(ZSCRIPT_FOLDER) && Shell.isFolder(ZSCRIPT_FOLDER);

    if (fileExists && folderExists) {
        const STYLE_ERROR = Format.foreground(Color.Red) + Format.bold();
        const STYLE_RESET = Format.reset();
        console.log(
            `${STYLE_ERROR}Error:${STYLE_RESET} ambiguous Z-Script: both a file named ` +
            `"${ZSCRIPT_FILE}" and a folder named "${ZSCRIPT_FOLDER}" exist in the current directory.`
        );
        process.exit(1);
    }

    if (fileExists) {
        return Workspace.File;
    }

    if (folderExists) {
        return Workspace.Folder;
    }

    return null;
}

function abortIfNoZScript(workspace: Workspace | null): asserts workspace is Workspace {
    if (workspace === null) {
        const STYLE_ERROR = Format.foreground(Color.Red) + Format.bold();
        const STYLE_RESET = Format.reset();
        console.log(`${STYLE_ERROR}Error:${STYLE_RESET} no Z-Script found.`);
        process.exit(1);
    }
}

function watch(workspace: Workspace) {
    createExecutionSymlink(workspace);
    // TODO: can this be fixed?
    exec(`npx tsc-watch ${ZSCRIPT_FILE} --noClear`);
}

function createExecutionSymlink(workspace: Workspace) {
    exec(`mkdir -p ${ZSCRIPT_OUTPUT_FOLDER}`);

    switch (workspace) {
        case Workspace.File:
            exec(`ln -s ${ZSCRIPT_JS_FILE} ${ZSCRIPT_EXECUTABLE_FILE}`);
            break;
        case Workspace.Folder:
            // Nothing to do: since every Z-Script folder has a main.ts, its
            // corresponding file will automatically be main.js.
            break;
    }
}

function recompileIfNeeded(workspace: Workspace) {
    if (needsRecompilation(workspace)) {
        recompile(workspace);
    }
}

function needsRecompilation(workspace: Workspace): boolean {
    if (!Shell.fileExists(ZSCRIPT_OUTPUT_FOLDER)) {
        return true;
    }

    if (!Shell.isFolder(ZSCRIPT_OUTPUT_FOLDER)) {
        return true;
    }

    switch (workspace) {
        case Workspace.File:
            return Shell.isNewerThan(ZSCRIPT_FILE, `${ZSCRIPT_OUTPUT_FOLDER}/${ZSCRIPT_JS_FILE}`);
        case Workspace.Folder:
            return Shell.isNewerThan(ZSCRIPT_FOLDER, ZSCRIPT_EXECUTABLE_FILE);
    }
}

function recompile(workspace: Workspace) {
    const STYLE_COMPILING = Format.foreground(Color.Yellow);
    const STYLE_RESET = Format.reset();
    console.log(`${STYLE_COMPILING}Compiling Z-Script...${STYLE_RESET}`);

    createExecutionSymlink(workspace);

    switch (workspace) {
        case Workspace.File:
            exec(`npx tsc ${ZSCRIPT_FILE} --outDir ${ZSCRIPT_OUTPUT_FOLDER}`);
            break;
        case Workspace.Folder:
            exec(`npx tsc ${ZSCRIPT_FOLDER_MAIN_FILE} --outDir ${ZSCRIPT_OUTPUT_FOLDER}`);
            break;
    }
}

function runZScript(args: string[]) {
    exec(`node ${ZSCRIPT_EXECUTABLE_FILE} ${args.join(' ')}`);
}

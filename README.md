# Z-Script

A set of utilities that easily allow creating command-line scripts.

## Installation

You can install Z-Script by running:
```
npm install --save-dev @ghabriel/z-script
```

You may also want to install it globally to be able to use `zsc` directly without `npx`:
```
npm install -g @ghabriel/z-script
```

## Usage

Create a file named `zscript.ts` in your project. You can run it directly by running this at its directory:
```bash
# if zsc is installed globally
zsc [args...]

# if zsc is only installed locally
npx zsc [args...]
```

Syntax examples can be found in `src/examples.ts`.

import { ParsedArguments, ParsedFlags } from './ParsedArguments';
import { ParseError } from './ParseError';

export interface FlagMetadata {
    [flag: string]: boolean /* does it require parameters? */;
}

export function parseArgs<T extends FlagMetadata>(
    args: string[],
    metadata: T
): ParsedArguments<T> {
    const parsedFlags = createEmptyParsedFlags(metadata);
    const standaloneArgs: string[] = [];
    let i = 0;

    while (i < args.length) {
        const arg = args[i];

        if (arg === '--') {
            standaloneArgs.push(...args.slice(i + 1));
            break;
        }

        if (isFlag(arg, metadata)) {
            i = handleFlag(args, i, metadata, parsedFlags);
        } else {
            standaloneArgs.push(arg);
            i++;
        }
    }

    return new ParsedArguments(parsedFlags, standaloneArgs);
}

function createEmptyParsedFlags<T extends FlagMetadata>(metadata: T): ParsedFlags<T> {
    const result: Partial<ParsedFlags<T>> = {};

    for (const key in metadata) {
        result[key] = {
            occurrences: 0,
            args: [],
        };
    }

    return result as ParsedFlags<T>;
}

function handleFlag<T extends FlagMetadata>(
    args: string[],
    i: number,
    metadata: T,
    parsedFlags: ParsedFlags<T>,
): number {
    const arg = args[i];

    const flagData = parsedFlags[arg];
    flagData.occurrences++;

    const requiresParameters = metadata[arg];
    if (requiresParameters) {
        const nextArg = args[i + 1];

        if (nextArg === undefined || isFlag(nextArg, metadata)) {
            throw new ParseError(`Flag "${arg}" expects a parameter`);
        }

        flagData.args.push(nextArg);
        i++;
    }

    i++;
    return i;
}

function isFlag(arg: string, metadata: FlagMetadata): boolean {
    return metadata.hasOwnProperty(arg);
}

import { FlagMetadata, ParsedArguments, ParsedFlagData } from './ParsedArguments';
import { ParseError } from './ParseError';

/**
 * Parses a list of arguments according to given metadata. The metadata must be
 * a map that contains each valid flag (the keys) and whether or not each of
 * them expect parameters (the values). Returns a `ParsedArguments` instance
 * that allows the results to be queried.
 */
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

function createEmptyParsedFlags<T extends FlagMetadata>(metadata: T): ParsedFlagData<T> {
    const result: Partial<ParsedFlagData<T>> = {};

    for (const key in metadata) {
        result[key] = {
            occurrences: 0,
            args: [],
        };
    }

    return result as ParsedFlagData<T>;
}

function handleFlag<T extends FlagMetadata>(
    args: string[],
    i: number,
    metadata: T,
    parsedFlags: ParsedFlagData<T>,
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

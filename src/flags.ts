export type ParsedArguments<T extends FlagMetadata> = {
    [K in keyof T]: FlagData;
} & {
    args: string[];
};

export interface FlagMetadata {
    [flag: string]: boolean /* does it require parameters? */;
}

export interface FlagData {
    occurrences: number;
    args: string[];
}

export function parseArgs<T extends FlagMetadata>(
    args: string[],
    metadata: T
): ParsedArguments<T> {
    const result = createEmptyParsedArguments(metadata);
    let i = 0;

    while (i < args.length) {
        const arg = args[i];

        if (arg === '--') {
            result.args.push(...args.slice(i + 1));
            break;
        }

        if (isFlag(arg, metadata)) {
            i = handleFlag(args, i, metadata, result);
        } else {
            result.args.push(arg);
            i++;
        }
    }

    return result;
}

function createEmptyParsedArguments<T extends FlagMetadata>(
    metadata: T
): ParsedArguments<T> {
    const result: Partial<ParsedArguments<T>> = {};

    for (const key in metadata) {
        result[key] = {
            occurrences: 0,
            args: [],
        } as any;
    }

    result.args = [] as any;

    return result as ParsedArguments<T>;
}

function handleFlag<T extends FlagMetadata>(
    args: string[],
    i: number,
    metadata: T,
    result: ParsedArguments<T>,
): number {
    const arg = args[i];

    const flagData = result[arg];
    flagData.occurrences++;

    const requiresParameters = metadata[arg];
    if (requiresParameters) {
        const nextArg = args[i + 1];

        if (nextArg === undefined || isFlag(nextArg, metadata)) {
            throw Error(`Flag "${arg}" expects a parameter`);
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

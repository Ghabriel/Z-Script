export interface FlagData {
    occurrences: number;
    args: string[];
}

export function hasFlag(args: string[], flag: string): boolean {
    return getFlagData(args, flag).occurrences > 0;
}

export function getFlagData(
    args: string[],
    flag: string,
    hasParameters: boolean = false
): FlagData {
    const flagData: FlagData = {
        occurrences: 0,
        args: [],
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === '--') {
            break;
        }

        if (arg === flag) {
            flagData.occurrences++;

            if (i === args.length - 1) {
                break;
            }

            const nextArg = args[i + 1];

            if (hasParameters && !nextArg.startsWith('-')) {
                flagData.args.push(nextArg);
            }
        }
    }

    return flagData;
}


export interface FlagMetadata {
    [flag: string]: boolean;
}

export type ParsedArguments<T extends FlagMetadata> = {
    [K in keyof T]: FlagData;
} & {
    args: string[];
};

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
            const flagData = result[arg];
            flagData.occurrences++;

            const requiresParameters = metadata[arg];

            if (requiresParameters) {
                if (i === args.length - 1) {
                    throw Error(`Flag "${arg}" expects a parameter`);
                }

                const nextArg = args[i + 1];

                if (isFlag(nextArg, metadata)) {
                    throw Error(`Flag "${arg}" expects a parameter`);
                }

                flagData.args.push(nextArg);
                i++;
            }
        } else {
            result.args.push(arg);
        }

        i++;
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

function isFlag(arg: string, metadata: FlagMetadata): boolean {
    return metadata.hasOwnProperty(arg);
}

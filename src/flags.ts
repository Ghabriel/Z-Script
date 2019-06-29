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

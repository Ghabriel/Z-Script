export interface FlagMetadata {
    [flag: string]: boolean /* does it require parameters? */;
}

export type ParsedFlagData<T extends FlagMetadata> = {
    [K in keyof T]: {
        occurrences: number;
        args: string[];
    };
};

export class ParsedArguments<T extends FlagMetadata> {
    constructor(
        private flags: ParsedFlagData<T>,
        private args: string[]
    ) { }

    /**
     * Checks if a given flag was passed.
     */
    hasFlag(flag: keyof T): boolean {
        return this.getFlagCount(flag) > 0;
    }

    /**
     * Returns the number of times that a given flag was passed.
     */
    getFlagCount(flag: keyof T): number {
        return this.flags[flag].occurrences;
    }

    /**
     * Returns the arguments associated with a given flag.
     */
    getFlagArgs(flag: keyof T): ReadonlyArray<string> {
        return this.flags[flag].args;
    }

    /**
     * Returns all "standalone" arguments, i.e arguments that are not
     * associated with any flags.
     */
    getArgs(): ReadonlyArray<string> {
        return this.args;
    }

    /**
     * Returns a new `ParsedArguments` instance in which all occurrences
     * of the second given flag are treated as occurrences of the first.
     */
    mergeFlags<K extends keyof T>(first: keyof T, second: K): ParsedArguments<Omit<T, K>> {
        type Result = ParsedFlagData<Omit<T, K>>;
        const resultFlags: Result = this.getFlagSubset(k => k !== second);

        const firstData = resultFlags[first as keyof Result];
        firstData.occurrences += this.flags[second].occurrences;
        firstData.args.push(...this.flags[second].args);

        return new ParsedArguments(resultFlags, this.args);
    }

    private getFlagSubset(predicate: (key: keyof T) => boolean): ParsedFlagData<any> {
        const resultFlags: Partial<ParsedFlagData<any>> = {};

        for (const key in this.flags) {
            if (predicate(key)) {
                resultFlags[key] = this.flags[key];
            }
        }

        return this.deepCopy(resultFlags) as ParsedFlagData<any>;
    }

    private deepCopy<T extends object>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }
}

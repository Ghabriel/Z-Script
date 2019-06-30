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
}

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

    hasFlag(flag: keyof T): boolean {
        return this.getFlagCount(flag) > 0;
    }

    getFlagCount(flag: keyof T): number {
        return this.flags[flag].occurrences;
    }

    getFlagArgs(flag: keyof T): ReadonlyArray<string> {
        return this.flags[flag].args;
    }

    getArgs(): ReadonlyArray<string> {
        return this.args;
    }
}

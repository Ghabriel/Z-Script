import { FlagMetadata } from './parse-args';

export type ParsedFlags<T extends FlagMetadata> = {
    [K in keyof T]: FlagData;
};

export interface FlagData {
    occurrences: number;
    args: string[];
}

export class ParsedArguments<T extends FlagMetadata> {
    constructor(
        private flags: ParsedFlags<T>,
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

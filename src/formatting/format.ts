import { BackgroundColor, ForegroundColor } from './color-codes';

export namespace Format {
    export function setForeground(color: ForegroundColor): void {
        useCode(color);
    }

    export function setBackground(color: BackgroundColor): void {
        useCode(color);
    }

    export function setBold(): void {
        useCode(1);
    }

    export function setUnderline(): void {
        useCode(4);
    }

    export function resetForeground(): void {
        setForeground(ForegroundColor.Default);
    }

    export function resetBackground(): void {
        setBackground(BackgroundColor.Default);
    }

    export function resetBold(): void {
        useCode(21);
    }

    export function resetUnderline(): void {
        useCode(24);
    }

    export function resetFontStyle(): void {
        useCode(0);
    }

    function useCode(code: number): void {
        process.stdout.write(`\x1b[${code}m`);
    }
}

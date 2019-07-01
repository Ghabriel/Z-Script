import { Color, getBackgroundCode, getForegroundCode } from './color-codes';

export namespace Format {
    export namespace foreground {
        export function set(color: Color): void {
            useCode(getForegroundCode(color));
        }

        export function reset(): void {
            set(Color.Default);
        }
    }

    export namespace background {
        export function set(color: Color): void {
            useCode(getBackgroundCode(color));
        }

        export function reset(): void {
            set(Color.Default);
        }
    }

    export namespace bold {
        export function set(): void {
            useCode(1);
        }

        export function reset(): void {
            useCode(21);
        }
    }

    export namespace underline {
        export function set(): void {
            useCode(4);
        }

        export function reset(): void {
            useCode(24);
        }
    }

    export function reset(): void {
        useCode(0);
    }

    function useCode(code: number): void {
        process.stdout.write(`\x1b[${code}m`);
    }
}

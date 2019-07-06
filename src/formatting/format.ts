import { Color, getBackgroundCode, getForegroundCode } from './color-codes';

/**
 * Namespace with utilities that allow the user to change the current
 * foreground color, background color, bold/bright mode and underlined text.
 */
export namespace Format {
    /**
     * Foreground color configuration.
     */
    export namespace foreground {
        /**
         * Sets the current foreground color.
         */
        export function set(color: Color): void {
            printCode(getSetCode(color));
        }

        /**
         * Resets the foreground color.
         */
        export function reset(): void {
            printCode(getResetCode());
        }

        /**
         * Returns the necessary code to set the current foreground color
         * to the given color.
         */
        export function getSetCode(color: Color): string {
            return prepareCode(getForegroundCode(color));
        }

        /**
         * Returns the necessary code to reset the current foreground color.
         */
        export function getResetCode(): string {
            return getSetCode(Color.Default);
        }
    }

    /**
     * Background color configuration.
     */
    export namespace background {
        /**
         * Sets the current background color.
         */
        export function set(color: Color): void {
            printCode(getSetCode(color));
        }

        /**
         * Resets the background color.
         */
        export function reset(): void {
            printCode(getResetCode());
        }

        /**
         * Returns the necessary code to set the current background color
         * to the given color.
         */
        export function getSetCode(color: Color): string {
            return prepareCode(getBackgroundCode(color));
        }

        /**
         * Returns the necessary code to reset the current background color.
         */
        export function getResetCode(): string {
            return getSetCode(Color.Default);
        }
    }

    /**
     * Bold/bright configuration.
     */
    export namespace bold {
        /**
         * Enables bold/bright mode.
         */
        export function set(): void {
            printCode(getSetCode());
        }

        /**
         * Disables bold/bright mode.
         */
        export function reset(): void {
            printCode(getResetCode());
        }

        /**
         * Returns the necessary code to enable bold/bright mode.
         */
        export function getSetCode(): string {
            return prepareCode(1);
        }

        /**
         * Returns the necessary code to disable bold/bright mode.
         */
        export function getResetCode(): string {
            return prepareCode(21);
        }
    }

    /**
     * Underlined text configuration.
     */
    export namespace underline {
        /**
         * Enables underlined text.
         */
        export function set(): void {
            printCode(getSetCode());
        }

        /**
         * Disables underlined text.
         */
        export function reset(): void {
            printCode(getResetCode());
        }

        /**
         * Returns the necessary code to enable underlined text.
         */
        export function getSetCode(): string {
            return prepareCode(4);
        }

        /**
         * Returns the necessary code to disable underlined text.
         */
        export function getResetCode(): string {
            return prepareCode(24);
        }
    }

    /**
     * Resets all formatting (foreground, background, bold/bright and
     * underline).
     */
    export function reset(): void {
        printCode(getResetCode());
    }

    /**
     * Returns the necessary code to reset all formatting (foreground,
     * background, bold/bright and underline).
     */
    export function getResetCode(): string {
        return prepareCode(0);
    }

    function prepareCode(code: number): string {
        return `\x1b[${code}m`;
    }

    function printCode(code: string): void {
        process.stdout.write(code);
    }
}

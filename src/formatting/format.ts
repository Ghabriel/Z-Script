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
            useCode(getForegroundCode(color));
        }

        /**
         * Resets the foreground color.
         */
        export function reset(): void {
            set(Color.Default);
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
            useCode(getBackgroundCode(color));
        }

        /**
         * Resets the background color.
         */
        export function reset(): void {
            set(Color.Default);
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
            useCode(1);
        }

        /**
         * Disables bold/bright mode.
         */
        export function reset(): void {
            useCode(21);
        }
    }

    /**
     * Underlined text configuration.
     */
    export namespace underline {
        /**
         * Enables underlined text
         */
        export function set(): void {
            useCode(4);
        }

        /**
         * Disables underlined text
         */
        export function reset(): void {
            useCode(24);
        }
    }

    /**
     * Resets all formatting (foreground, background, bold/bright and
     * underline)
     */
    export function reset(): void {
        useCode(0);
    }

    function useCode(code: number): void {
        process.stdout.write(`\x1b[${code}m`);
    }
}

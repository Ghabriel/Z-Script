import { Color, getBackgroundCode, getForegroundCode } from './color-codes';

const styleHistory: string[] = [];

/**
 * Namespace with utilities that allow the user to change the current
 * foreground color, background color, bold/bright mode and underlined text.
 */
export namespace Format {
    /**
     * Returns the necessary code to set the current foreground color
     * to the given color.
     */
    export function foreground(color: Color): string {
        return prepareCode(getForegroundCode(color));
    }

    /**
     * Returns the necessary code to set the current background color
     * to the given color.
     */
    export function background(color: Color): string {
        return prepareCode(getBackgroundCode(color));
    }

    /**
     * Returns the necessary code to enable bold/bright mode.
     */
    export function bold(): string {
        return prepareCode(1);
    }

    /**
     * Returns the necessary code to enable underlined text.
     */
    export function underline(): string {
        return prepareCode(4);
    }

    /**
     * Returns the necessary code to reset all formatting (foreground,
     * background, bold/bright and underline).
     */
    export function reset(): string {
        return prepareCode(0);
    }

    /**
     * Applies the given style code and pushes it to the stack.
     */
    export function apply(code: string) {
        styleHistory.push(code);
        applyStyle(code);
    }

    /**
     * Overwrites the current style code (popping it from the stack) with the
     * last one.
     */
    export function pop() {
        styleHistory.pop();
        applyStyle(reset());

        if (styleHistory.length > 0) {
            const currentStyle = styleHistory[styleHistory.length - 1];
            applyStyle(currentStyle);
        }
    }

    function prepareCode(code: number): string {
        return `\x1b[${code}m`;
    }

    function applyStyle(code: string) {
        process.stdout.write(code);
    }
}

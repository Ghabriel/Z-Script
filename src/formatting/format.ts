import { BackgroundColor, FontDecoration, ForegroundColor } from './color-codes';

export function applyForegroundColor(color: ForegroundColor): void {
    applyFontStyle(color);
}

export function applyBackgroundColor(color: BackgroundColor): void {
    applyFontStyle(undefined, color);
}

export function applyDecoration(decoration: FontDecoration): void {
    applyFontStyle(undefined, undefined, decoration);
}

export function resetForegroundColor(): void {
    applyForegroundColor(ForegroundColor.Default);
}

export function resetBackgroundColor(): void {
    applyBackgroundColor(BackgroundColor.Default);
}

export function resetDecoration(): void {
    resetBold();
    resetUnderline();
}

export function resetBold(): void {
    process.stdout.write('\x1b[21m');
}

export function resetUnderline(): void {
    process.stdout.write('\x1b[24m');
}

export function resetFontStyle(): void {
    process.stdout.write('\x1b[0m');
}

export function applyFontStyle(
    fg: ForegroundColor,
    bg?: BackgroundColor,
    decoration?: FontDecoration
): void;

export function applyFontStyle(
    fg: ForegroundColor | undefined,
    bg: BackgroundColor,
    decoration?: FontDecoration
): void;

export function applyFontStyle(
    fg: ForegroundColor | undefined,
    bg: BackgroundColor | undefined,
    decoration: FontDecoration
): void;

export function applyFontStyle(
    fg?: ForegroundColor,
    bg?: BackgroundColor,
    decoration?: FontDecoration,
): void {
    const code = [fg, bg, decoration]
        .filter(isDefined)
        .join(';');

    process.stdout.write(`\x1b[${code}m`);
}

function isDefined<T>(value: T | undefined): value is T {
    return value !== undefined;
}

export enum Color {
    Default,

    Black,
    Red,
    Green,
    Yellow,
    Blue,
    Magenta,
    Cyan,
    LightGray,

    DarkGray,
    LightRed,
    LightGreen,
    LightYellow,
    LightBlue,
    LightMagenta,
    LightCyan,
    White,
}

export function getForegroundCode(color: Color): number {
    switch (color) {
        case Color.Default:
            return 39;

        case Color.Black:
            return 30;
        case Color.Red:
            return 31;
        case Color.Green:
            return 32;
        case Color.Yellow:
            return 33;
        case Color.Blue:
            return 34;
        case Color.Magenta:
            return 35;
        case Color.Cyan:
            return 36;
        case Color.LightGray:
            return 37;

        case Color.DarkGray:
            return 90;
        case Color.LightRed:
            return 91;
        case Color.LightGreen:
            return 92;
        case Color.LightYellow:
            return 93;
        case Color.LightBlue:
            return 94;
        case Color.LightMagenta:
            return 95;
        case Color.LightCyan:
            return 96;
        case Color.White:
            return 97;
    }
}

export function getBackgroundCode(color: Color): number {
    return getForegroundCode(color) + 10;
}

import { Color, Format } from '../formatting';

export abstract class ZScriptError extends Error {
    abstract print(): void;

    protected printErrorPrefix() {
        const STYLE_ERROR = Format.foreground(Color.Red) + Format.bold();
        Format.print('Error: ', STYLE_ERROR);
    }
}

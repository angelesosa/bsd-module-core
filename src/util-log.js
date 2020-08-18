'use strict';

import Util from "./util";
import UtilDate from "./util-date";

export default class UtilLog {

    static get consoleColors() {
        return {
            reset: "\x1b[0m",
            bright: "\x1b[1m",
            dim: "\x1b[2m",
            underscore: "\x1b[4m",
            blink: "\x1b[5m",
            reverse: "\x1b[7m",
            hidden: "\x1b[8m",
            fg: {
                black: "\x1b[30m",
                red: "\x1b[31m",
                green: "\x1b[32m",
                yellow: "\x1b[33m",
                blue: "\x1b[34m",
                magenta: "\x1b[35m",
                brightMagenta: "\x1b[95m",
                cyan: "\x1b[36m",
                brightCyan: "\x1b[96m",
                white: "\x1b[37m",
                crimson: "\x1b[38m"
            },
            bg: {
                black: "\x1b[40m",
                red: "\x1b[41m",
                green: "\x1b[42m",
                yellow: "\x1b[43m",
                blue: "\x1b[44m",
                magenta: "\x1b[45m",
                cyan: "\x1b[46m",
                white: "\x1b[47m",
                crimson: "\x1b[48m"
            }
        }
    }

    static print(payload) {
        const {
            keyColor = `${this.consoleColors.fg.brightMagenta}%s${this.consoleColors.reset}`,
            key = '',
            value = '',
            extra = [], // data adicional
        } = payload || {};
        const date = UtilDate.formatMilliseconds().date;
        console.log(...[keyColor, key, '|', date, '|', value], ...extra);
    }

    static consoleRamdonColor() {
        // colores que se ven bien por la consola dark
        const colors = {
            brightCyan: this.consoleColors.fg.brightCyan,
            brightMagenta: this.consoleColors.fg.brightMagenta,
            green: this.consoleColors.fg.green,
            yellow: this.consoleColors.fg.yellow,
        };
        return `${Util.randomProperty(colors)}%s${this.consoleColors.reset}`;
    }
}

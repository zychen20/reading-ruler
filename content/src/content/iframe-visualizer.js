/*
 * Copyright 2020-2021 Oren Trutner
 *
 * This file is part of Reading Ruler.
 *
 * Reading Ruler is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Reading Ruler is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Reading Ruler.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * A ruler visualizer that proxies mouse movement from inside an iframe to the
 * ruler on the containing page.  This visualizer is used inside iframes to
 * avoid multiple rulers in the same browser window.  Multiple rulers are
 * particularly disruptive when the negative visualizer is used, as the darkened
 * areas around the ruler get darkened twice.
 */
class IframeVisualizer {
    constructor() {
        this.hide();
    }

    /** Shows the ruler. */
    show() { this.sendMessage(WINDOW_COMMANDS.show); }

    /** Hides the ruler. */
    hide() { this.sendMessage(WINDOW_COMMANDS.hide); }

    /** Temporarily hides the ruler. */
    stash() { this.sendMessage(WINDOW_COMMANDS.stash); }

    /** Sets the ruler's color. */
    setColor(color) { /* do nothing. */ }

    /** Sets the ruler's opacity. */
    setOpacity(newOpacity) { /* do nothing. */ }

    /** Positions and sizes the ruler to cover a specific rectangle. */
    positionAt(rect) {
        this.sendMessage({
            command: WINDOW_COMMANDS.positionAt,
            rect: rect
        });
    }

    /** Sends a message to the parent window. */
    sendMessage(message) {
        window.parent.postMessage(normalizeMessage(message));
    }
}

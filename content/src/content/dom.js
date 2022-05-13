/*
 * Copyright 2020-2022 Oren Trutner
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

/** Maps iframe window objects to their iframe elements. */
let frameCache = null;

/** Gets the iframe element hosting the given window. */
function frameFromWindow(frameWindow) {
    const cachedFrame = frameCache && frameCache.get(frameWindow);
    if (cachedFrame) {
        return cachedFrame;
    }

    for (const frame of window.document.getElementsByTagName('iframe')) {
        if (frame.contentWindow === frameWindow) {
            if (!frameCache) {
                frameCache = new Map();
            }
            frameCache.set(frameWindow, frame);
            return frame;
        }
    }

    return null;
}

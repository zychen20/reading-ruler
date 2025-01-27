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

/*
 * Rectangle functions.  Should work on DOMRect values, e.g. as returned from
 * Element.getBoundingClientRect.  Note that mutating functions might not work
 * on DOMRectReadOnly properties.
 */

/** Checks if a rectangle has zero size. */
function rectIsEmpty(rect) {
    return rect.width <= 0 || rect.height <= 0;
}

/** Checks if two rectangles are equal. */
function rectsAreEqual(rect1, rect2) {
    return (rect1 === rect2
        || (rect1 && rect2
            && rect1.x === rect2.x
            && rect1.y === rect2.y
            && rect1.width === rect2.width
            && rect1.height === rect2.height));
}

/** Checks if a rectangle contains a point. */
function rectContains(rect, x, y) {
    return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}

/** Translates the rect, in place, by a given offset. */
function translateRect(rect, x, y) {
    rect.x += x;
    rect.y += y;
}

/** Gets a translated copy of the given rect. */
function translatedRect(rect, x, y) {
    const translated = { ...rect };
    translateRect(translated, x, y);
    return translated;
}

/** Increases the size of a rectangle, in place, by a given amount. */
function inflateRect(rect, x, y) {
    rect.x -= x;
    rect.y -= y;
    rect.width += 2 * x;
    rect.height += 2 * y;
}

/** Rounds the coordinates of a rectangle, in place. */
function roundRect(rect) {
    rect.x = Math.round(rect.x);
    rect.y = Math.round(rect.y);
    rect.width = Math.round(rect.width);
    rect.height = Math.round(rect.height);
}
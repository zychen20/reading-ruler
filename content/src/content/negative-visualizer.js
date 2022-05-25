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

/** A ruler visualizer that darkens the page except for the ruler row. */
class NegativeVisualizer {
    static PREFIX = '--reading-ruler-';
    static TOP_ID = NegativeVisualizer.PREFIX + 'top';
    static MASK_ID = NegativeVisualizer.PREFIX + 'mask';
    static BOTTOM_ID = NegativeVisualizer.PREFIX + 'bottom';

    static Visibility = {
        SHOW: 1,
        HIDE: 2,
        STASH: 3,

        showOverlay(visibility) {
            return visibility === NegativeVisualizer.Visibility.SHOW || visibility == NegativeVisualizer.Visibility.STASH;
        },

        showMask(visibility) {
            return visibility === NegativeVisualizer.Visibility.STASH;
        }
    };

    constructor() {
        this.opacity = 0.2;
        this.visibility = NegativeVisualizer.Visibility.STASH;
    }

    /** Adds the visualizer's elements into the document. */
    addToDocument() {
        this.topElement = document.getElementById(NegativeVisualizer.TOP_ID)
        if (!this.topElement) {
            this.topElement = document.createElement('div');
            this.topElement.id = NegativeVisualizer.TOP_ID;
            this.topElement.className = NegativeVisualizer.TOP_ID;
            document.body.appendChild(this.topElement);
        }

        this.maskElement = document.getElementById(NegativeVisualizer.MASK_ID);
        if (!this.maskElement) {
            this.maskElement = document.createElement('div');
            this.maskElement.id = NegativeVisualizer.MASK_ID;
            this.maskElement.className = NegativeVisualizer.MASK_ID;
            document.body.append(this.maskElement);
        }

        this.bottomElement = document.getElementById(NegativeVisualizer.BOTTOM_ID)
        if (!this.bottomElement) {
            this.bottomElement = document.createElement('div');
            this.bottomElement.id = NegativeVisualizer.BOTTOM_ID;
            this.bottomElement.className = NegativeVisualizer.BOTTOM_ID;
            document.body.appendChild(this.bottomElement);
        }

        this.hide();
    }

    /** Removes the visualizer's elements from the document. */
    removeFromDocument() {
        if (this.topElement) {
            this.topElement.remove();
            this.topElement = null;
            this.maskElement.remove();
            this.maskElement = null;
            this.bottomElement.remove();
            this.bottomElement = null;

            this.visibility = NegativeVisualizer.Visibility.HIDE;
        }
    }

    /** Shows the ruler. */
    show() {
        if (!NegativeVisualizer.Visibility.showOverlay(this.visibility)) {
            this.topElement.style.opacity = this.opacity;
            this.bottomElement.style.opacity = this.opacity;
        }

        if (NegativeVisualizer.Visibility.showMask(this.visibility)) {
            this.maskElement.style.opacity = 0;
        }

        this.visibility = NegativeVisualizer.Visibility.SHOW;
    }

    /** Hides the ruler. */
    hide() {
        if (NegativeVisualizer.Visibility.showOverlay(this.visibility)) {
            this.topElement.style.opacity = 0;
            this.bottomElement.style.opacity = 0;
        }

        if (NegativeVisualizer.Visibility.showMask(this.visibility)) {
            this.maskElement.style.opacity = 0;
        }

        this.visibility = NegativeVisualizer.Visibility.HIDE;
    }

    /** Temporarily hides the ruler. */
    stash() {
        if (!NegativeVisualizer.Visibility.showOverlay(this.visibility)) {
            this.topElement.style.opacity = this.opacity;
            this.bottomElement.style.opacity = this.opacity;
        }

        if (!NegativeVisualizer.Visibility.showMask(this.visibility)) {
            this.maskElement.style.opacity = this.opacity;
        }

        this.visibility = NegativeVisualizer.Visibility.STASH;
    }

    /** Sets the ruler's color. */
    setColor(color) {
        // Do nothing.
    }

    /** Sets the ruler's opacity. */
    setOpacity(newOpacity) {
        this.opacity = newOpacity;

        if (NegativeVisualizer.Visibility.showOverlay(this.visibility)) {
            this.topElement.style.opacity = newOpacity;
            this.bottomElement.style.opacity = newOpacity;
        }

        if (NegativeVisualizer.Visibility.showMask(this.visibility)) {
            this.maskElement.style.opacity = newOpacity;
        }
    }

    /** Positions and sizes the ruler to cover a specific rectangle. */
    positionAt(rect) {
        const widthPx = window.innerWidth + 'px';

        this.topElement.style.left = '0px';
        this.topElement.style.top = '0px';
        this.topElement.style.width = widthPx;
        this.topElement.style.height = rect.y + 'px';

        this.maskElement.style.left = '0px';
        this.maskElement.style.top = rect.y + 'px';
        this.maskElement.style.width = widthPx;
        this.maskElement.style.height = rect.height + 'px';
        this.maskElement.style.opacity = 0;

        this.bottomElement.style.left = '0px';
        this.bottomElement.style.top = (rect.y + rect.height) + 'px';
        this.bottomElement.style.width = widthPx;
        this.bottomElement.style.height = (window.innerHeight - rect.y - rect.height) + 'px';

        if (this.visibility === NegativeVisualizer.Visibility.STASH) {
            this.visibility = NegativeVisualizer.Visibility.SHOW;
        }
        this.lastPosition = rect;
    }
}

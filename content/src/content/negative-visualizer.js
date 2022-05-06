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

/** A ruler visualizer that darkens the page except for the ruler row. */
class NegativeVisualizer {
    constructor() {
        const PREFIX = '--reading-ruler-';
        const TOP_ID = PREFIX + 'top';
        const MASK_ID = PREFIX + 'mask';
        const BOTTOM_ID = PREFIX + 'bottom';

        this.opacity = 0.2;
        this.overlayVisible = true;
        this.rulerVisible = false;

        this.topElement = document.getElementById(TOP_ID)
        if (!this.topElement) {
            this.topElement = document.createElement('div');
            this.topElement.id = TOP_ID;
            this.topElement.className = TOP_ID;
            document.body.appendChild(this.topElement);
        }

        this.maskElement = document.getElementById(MASK_ID);
        if (!this.maskElement) {
            this.maskElement = document.createElement('div');
            this.maskElement.id = MASK_ID;
            this.maskElement.className = MASK_ID;
            document.body.append(this.maskElement);
        }

        this.bottomElement = document.getElementById(BOTTOM_ID)
        if (!this.bottomElement) {
            this.bottomElement = document.createElement('div');
            this.bottomElement.id = BOTTOM_ID;
            this.bottomElement.className = BOTTOM_ID;
            document.body.appendChild(this.bottomElement);
        }

        this.hide();
    }

    /** Checks if the ruler should be visible in its current state. */
    isVisible() {
        return this.overlayVisible || this.rulerVisible;
    }

    /** Shows the ruler. */
    show() {
        if (!this.overlayVisible) {
            this.topElement.style.opacity = this.opacity;
            this.maskElement.style.opacity = 0;
            this.bottomElement.style.opacity = this.opacity;

            this.overlayVisible = true;
        }
    }

    /** Hides the ruler. */
    hide() {
        if (this.overlayVisible) {
            this.topElement.style.opacity = 0;
            this.maskElement.style.opacity = 0;
            this.bottomElement.style.opacity = 0;

            this.overlayVisible = false;
        }
    }

    /** Temporarily hides the ruler. */
    stash() {
        this.topElement.style.opacity = this.opacity;
        this.maskElement.style.opacity = this.opacity;
        this.bottomElement.style.opacity = this.opacity;
        this.rulerVisible = false;
    }

    /** Sets the ruler's color. */
    setColor(color) {
        // Do nothing.
    }

    /** Sets the ruler's opacity. */
    setOpacity(newOpacity) {
        this.opacity = newOpacity;
        if (this.overlayVisible) {
            this.topElement.style.opacity = newOpacity;
            this.maskElement.style.opacity = newOpacity;
            this.bottomElement.style.opacity = newOpacity;
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

        this.rulerVisible = true;
        this.lastPosition = rect;
    }
}

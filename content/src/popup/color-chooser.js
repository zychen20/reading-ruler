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

/** A UI component for choosing a color from a short list of named colors. */
class ColorChooser {
    constructor(element) {
        this.element = element;
        this.inputs = [];
        this.chooseHandlers = [];

        // Create a radio button for each color.
        for (let color of COLORS) {
            // Create a radio button for the color.
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'color';
            input.id = 'color' + color.name;
            input.value = color.name;

            this.inputs.push(input);
            this.element.appendChild(input);

            // Create a label for the radio button.  The label renders the color
            // or icon if the color has an icon associated with it.
            const label = document.createElement('label');
            label.htmlFor = input.id;
            label.style = `background-color: ${color.hex};`;
            if (color.icon) {
                const image = document.createElement('img');
                image.src = color.icon;
                image.width = 30;
                image.height = 30;
                label.appendChild(image);
            } else {
                label.innerText = ' ';
            }
            label.addEventListener('click', this.onClick.bind(this));
            this.element.appendChild(label);
        }
    }

    set disabled(value) {
        for (const input of this.inputs) {
            input.disabled = value;
        }
    }

    /** Selects the specified color in the chooser's UI. */
    chooseColor(colorName) {
        for (const input of this.inputs) {
            input.checked = input.value === colorName;
        }
    }

    /** Registers for events. */
    addEventListener(eventName, handler) {
        switch (eventName) {
            case 'choose':
                this.chooseHandlers.push(handler);
                break;
            default: throw new Error("Unrecognized event name.");
        }
    }

    /** Reacts to clicks on color radio buttons. */
    async onClick(e) {
        for (const handler of this.chooseHandlers) {
            handler({ colorName: e.target.previousSibling.value });
        }
    }
}

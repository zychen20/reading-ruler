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

class ColorChooser {
    constructor(options) {
        this.options = options;
        this.inputs = [];

        const colorButtons = document.getElementById('colorButtons');
        for (let color of COLORS) {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'color';
            input.id = 'color' + color.name;
            input.value = color.name;
            input.checked = color.name === options.colorName;

            this.inputs.push(input);
            colorButtons.appendChild(input);

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
            label.addEventListener('click', async e => {
                if (options.addonEnabled) {
                    options.colorName = e.target.previousSibling.value;
                    options.appearance = color.appearance;
                    await options.write();
                }
            });
            colorButtons.appendChild(label);
        }
    }

    set disabled(value) {
        for (const input of this.inputs) {
            input.disabled = value;
        }
    }
}

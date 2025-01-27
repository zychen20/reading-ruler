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

/** Represents the user-selected options for a given page. */
class Options {
    constructor(url) {
        this.url = url;
        this.host = new URL(url).host;
    }

    /** Should the add-on be enabled for the page? */
    get enabled() {
        return this.addonEnabled && this.domainEnabled && this.pageEnabled;
    }

    /** Gets the hex value of the ruler color. */
    get color() {
        return COLORS.find(color => color.name === this.colorName).hex;
    }

    /** Reads the options from local storage. */
    async read() {
        this.addonEnabled = !!await this.readValue('addonEnabled', true);
        this.domainEnabled = !!await this.readValue(this.host, true);
        this.pageEnabled = !!await this.readValue(this.url, true);
        this.appearance = await this.readValue('appearance', 'ruler');
        this.colorName = await this.readValue('colorName', COLORS[0].name);
        this.opacity = await this.readValue('opacity', 0.2);
    }

    /** Writes the options to local storage. */
    async write() {
        await this.writeValue('addonEnabled', this.addonEnabled);
        await this.writeValue(this.host, this.domainEnabled);
        await this.writeValue(this.url, this.pageEnabled);
        await this.writeValue('appearance', this.appearance);
        await this.writeValue('colorName', this.colorName);
        await this.writeValue('opacity', this.opacity);

        // Broadcast the option values throughout the add-on.
        await this.broadcast();
    }

    /** Broadcasts the option values throughout the add-on. */
    async broadcast() {
        await broadcast({
            command: INTERNAL_EXTENSION_COMMANDS.options,
            ...this.snap()
        });
    }

    /** Creates and returns a snapshot of the option value. */
    snap() {
        return {
            enabled: this.enabled,
            appearance: this.appearance,
            color: this.color,
            opacity: this.opacity
        };
    }

    /** Reads a single value from local storage. */
    async readValue(key, fallback) {
        const container = await browser.storage.local.get([ key ]);
        const value = container[key];
        return value !== undefined ? value : fallback;
    }

    /** Writes a single value to local storage. */
    async writeValue(key, value) {
        let container = {};
        container[key] = value;
        await browser.storage.local.set(container);
    }
}
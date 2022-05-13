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

/** Commands passed between content, background and popup scripts. */
const EXTENSION_COMMANDS = {
    activate: 'activate',
    deactivate: 'deactivate',
    options: 'options',
};

/** Commands passed between windows via window.postMessage() */
const WINDOW_COMMANDS = {
    show: 'show',
    hide: 'hide',
    stash: 'stash',
    positionAt: 'positionAt'
};

const WINDOW_MESSAGE_GUARD = 'reading-ruler';
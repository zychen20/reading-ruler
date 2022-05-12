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

/**
 * This is the entry point for the add-on's "content" script, i.e. the script
 * that executes within every web page that the browser loads.
 *
 * It creates a single ruler and sets up event handlers to highlight the row
 * under the mouse cursor every time the mouse moves or the page scrolls.
 */
(async function() {
    // Bail out if it looks like we're inside an advertising tracking iframe.
    const isInsideIframe = window.self !== window.top;
    if (isInsideIframe && window.innerWidth <= 100 || window.innerHeight <= 100) {
        return;
    }

    // Create the ruler.
    const ruler = new Ruler(isInsideIframe ? new IframeVisualizer() : null);

    // Track state.
    const mousePosition = { x: 0, y: 0 };

    // React to messages from the background and popup scripts.
    browser.runtime.onMessage.addListener(message => {
        switch (message.command) {
            case EXTENSION_COMMANDS.activate:
                ruler.activate();
                break;
            case EXTENSION_COMMANDS.deactivate:
                ruler.deactivate();
                break;
            case EXTENSION_COMMANDS.options:
                ruler.applyOptions(message);
                break;
            default:
                break;
        }
    });

    // React to messages from iframes.
    window.addEventListener('message', e => {
        switch (e.data && e.data.command) {
            case WINDOW_COMMANDS.show:
                ruler.show();
                break;
            case WINDOW_COMMANDS.hide:
                ruler.hide();
                break;
            case WINDOW_COMMANDS.stash:
                ruler.stash();
                break;
            case WINDOW_COMMANDS.positionAt:
                const frame = frameFromWindow(e.source);
                const frameRect = frame.getBoundingClientRect();
                const rulerRect = translatedRect(
                    e.data.rect,
                    frameRect.left - window.scrollX,
                    frameRect.top - window.scrollY);
                ruler.positionAt(rulerRect);
                break;
            default:
                break;
        }
    });

    // Reposition the ruler when the mouse moves.
    document.addEventListener('mousemove', function(e) {
        // Keep track of the mouse position.
        mousePosition.x = e.x;
        mousePosition.y = e.y;

        // Position the ruler to match the mouse position.
        ruler.positionAroundIfRowExited(mousePosition.x, mousePosition.y);
    });

    // Reposition the ruler to match the mouse when the document is scrolled.
    document.addEventListener('scroll', function(e) {
        ruler.positionAround(mousePosition.x, mousePosition.y);
    });

    // Deactivate the ruler when the mouse is outside the window.
    window.addEventListener('mouseout', e => {
        if (!e.relatedTarget) {
            ruler.deactivate();
        }
    });
    window.addEventListener('mouseover', e => {
        if (!e.relatedTarget) {
            ruler.activate();
        }
    });
    window.addEventListener('click', e => ruler.activate());

    // Enable and style the ruler based on page options.
    const options = new Options(window.location.href);
    await options.read();
    ruler.applyOptions(options.snap());
})();
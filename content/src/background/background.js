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

 const DEFAULT_ICON = {
    "48": "/icons/ruler-48.png",
    "96": "/icons/ruler-96.png",
    "128": "/icons/ruler-128.png"
};
const DISABLED_ICON = {
    "48": "/icons/ruler-disabled-48.png",
    "96": "/icons/ruler-disabled-96.png",
    "128": "/icons/ruler-disabled-128.png"
};


// Read and apply the page's options when it loads.
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (tab.status === 'complete' && tab.active) {
        // Read the options.
        const options = new Options(tab.url);
        await options.read();

        // Update the add-on's icon to reflect its enabled state.
        await updateIcon(options.enabled);
    }
});

// Reapply the page's options when the user switches to a different tab.
// This ensures the ruler is displayed with the current options even if the page
// wasn't active when the popup changes the options.
browser.tabs.onActivated.addListener(async activeInfo => {
    const tab = await getCurrentTab();
    const options = new Options(tab.url);
    await options.read();
    await options.broadcast();
    await updateIcon(options.enabled);
});

// Respond to hot-key commands, as specified in manifest.json.
browser.commands.onCommand.addListener(async command => {
    switch (command) {
        // Toggle the add-on's on/off state
        case MANIFEST_EXTENSION_COMMANDS.toggleAddon:
            const tab = await getCurrentTab();
            const options = new Options(tab.url);
            await options.read();
            options.addonEnabled = !options.addonEnabled;
            await options.write();
            await updateIcon(options.enabled);
            break;
        default:
            break;
    }
});

// Respond to messages from the options popup.
browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    switch(message.command) {
        case INTERNAL_EXTENSION_COMMANDS.options:
            await updateIcon(message.enabled);
            break;
        default:
            break;
    }
});
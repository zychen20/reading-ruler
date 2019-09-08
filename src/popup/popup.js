document.addEventListener('DOMContentLoaded', async () => {
    const tab = await getCurrentTab();
    const options = new Options(tab.url);
    await options.read();

    // Initialize and react to changes on the enable-for-domain checkbox.
    const enableForDomainCheckbox = document.getElementById('enableForDomain');
    enableForDomainCheckbox.checked = options.domainEnabled;
    enableForDomainCheckbox.addEventListener('change', async e => {
        options.domainEnabled = e.target.checked;
        await options.write();
    });

    // Initialize and react to changes on the enable-for-page checkbox.
    const enableForPageCheckbox = document.getElementById('enableForPage');
    enableForPageCheckbox.checked = options.pageEnabled;
    enableForPageCheckbox.addEventListener('change', async e => {
        options.pageEnabled = e.target.checked;
        await options.write();
    });
}, false);

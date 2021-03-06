﻿class EdgeExtension extends ExtensionBase {

    constructor() {
        super();
    }

    /**
     * @override
     * @param sender
     */
    isPopupRequest(sender: chrome.runtime.MessageSender) {
        return !!sender.id;
    }

    /** @override */
    showNotification(message: string, title?: string) {
        // Notifications are not supported:
        // https://docs.microsoft.com/en-us/microsoft-edge/extensions/api-support/extension-api-roadmap
    }

    /**
     * Create popup window
     * @override
     * @param width
     * @param height
     * @param left
     * @param top
     */
    createPopupWindow(width: number, height: number, left: number, top: number) {
        chrome.windows.create(<chrome.windows.CreateData>{
            left,
            top,
            width,
            height,
            focused: true,
            url: this.getLoginUrl(),
            type: 'popup'
        }, popupWindow => {

            var popupTab = popupWindow.tabs[0];

            this.loginWinId = popupWindow.id;
            this.loginTabId = popupTab.id;
            this.loginWindowPending = false;
        });
    }
}

new EdgeExtension();
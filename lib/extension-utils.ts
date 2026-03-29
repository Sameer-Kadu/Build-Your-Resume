/**
 * Utility for communicating with the "Apply Faster" Chrome Extension.
 */

declare global {
  const chrome: any;
}

const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID || 'placeholder-extension-id';

export interface ExtensionResponse {
  success: boolean;
  message?: string;
  version?: string;
}

/**
 * Check if the Chrome extension is installed and accessible.
 */
export const checkExtensionInstalled = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) {
      resolve(false);
      return;
    }

    try {
      chrome.runtime.sendMessage(EXTENSION_ID, { action: 'ping' }, (response: ExtensionResponse) => {
        if (chrome.runtime.lastError) {
          resolve(false);
        } else {
          resolve(response && response.success);
        }
      });
    } catch (e) {
      resolve(false);
    }
  });
};

/**
 * Send resume data to the extension for automated application.
 */
export const sendDataToExtension = (data: any, platform: string): Promise<ExtensionResponse> => {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) {
      resolve({ success: false, message: 'Extension not available' });
      return;
    }

    chrome.runtime.sendMessage(
      EXTENSION_ID,
      { action: 'apply', platform, data },
      (response: ExtensionResponse) => {
        if (chrome.runtime.lastError) {
          resolve({ success: false, message: chrome.runtime.lastError.message });
        } else {
          resolve(response || { success: true });
        }
      }
    );
  });
};

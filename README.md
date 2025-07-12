# RoboFormLocal - Form Saver Extension

RoboFormLocal is a lightweight and secure browser extension for Chrome and Edge that allows you to save and fill web forms with ease. It's designed for users who frequently fill out the same forms and want a simple way to manage different versions of their form data, all stored securely in their browser's synchronized storage.

## Features

- **Save Form Data**: Save the contents of any web form with a single click.
- **Custom Naming**: Assign a custom name to each saved form version for easy identification.
- **One-Click Fill**: Autofill forms with your saved data instantly.
- **Multiple Versions**: Store unlimited versions of form data for any single URL.
- **Cross-Device Sync**: Your saved form data syncs across all browsers where you are logged into the same profile (e.g., your Google or Microsoft account).
- **Secure Local Storage**: All data is stored using `chrome.storage.sync`, which is a secure, sandboxed storage provided by the browser.
- **Intuitive UI**: A simple popup interface allows you to save and manage your form data without hassle.
- **Context Menu Access**: Quickly save forms by right-clicking on them.

## How to Use

### Saving a Form

There are two ways to save form data:

1.  **From the Popup (Recommended):**
    *   Fill out the form on the webpage as you normally would.
    *   Click the **RoboFormLocal extension icon** in your browser's toolbar.
    *   In the popup window, enter a descriptive name for your form data (e.g., "Test User Profile" or "Shipping Address 1").
    *   Click the **"Save Current Form"** button. A success message will appear, and the new version will be added to the list.

2.  **From the Right-Click Menu:**
    *   Fill out the form on the webpage.
    *   **Right-click** anywhere inside the form.
    *   Select **"Save Form"** from the context menu. This will save the form data with the current date and time as its name.

### Filling a Form

1.  Navigate to a page for which you have previously saved form data.
2.  Click the **RoboFormLocal extension icon** in the browser's toolbar.
3.  The popup will display a list of all saved form versions for that URL, sorted with the newest first.
4.  Click on the desired version from the list. The form on the page will be instantly filled with the corresponding data.

## Manual Installation (for Developers)

To install this extension from the source code for development or testing:

1.  Clone or download this repository to your local machine.
2.  Open your browser (Chrome or Edge).
3.  Navigate to the extensions page:
    *   **Chrome**: `chrome://extensions`
    *   **Edge**: `edge://extensions`
4.  Enable **"Developer mode"** (usually a toggle switch in the corner of the page).
5.  Click the **"Load unpacked"** button.
6.  In the file selection dialog, navigate to and select the root directory of this project (the one containing `manifest.json`).
7.  The extension will be installed and ready to use.

**Note:** You may receive an error about missing icon files. The browser requires valid PNG images for the icons. You will need to replace the placeholder files in the `/icons` directory with actual 16x16, 48x48, and 128x128 PNG images.

## Technology Stack

-   HTML5
-   CSS3
-   JavaScript (ES6+)
-   WebExtensions API (Manifest V3)

---

This project is intended to be a simple, secure, and user-friendly tool for managing form data locally. 
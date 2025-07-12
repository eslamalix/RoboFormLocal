// A global variable to store the element that was right-clicked.
let rightClickedElement = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-form",
    title: "Save Form",
    contexts: ["all"]
  });
});

// Listener for the right-click context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-form") {
    chrome.tabs.sendMessage(tab.id, { action: "get_form_data" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }
      if (response && response.formData) {
        // Name is blank when saving from context menu
        saveFormData(tab.url, response.formData, ""); 
      } else {
        console.log("No form found at the clicked location.");
      }
    });
  }
});

// Listener for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'save_data') {
        saveFormData(request.url, request.data, request.name);
        sendResponse({status: 'success'});
    }
    return true; // Indicates async response
});


function saveFormData(url, data, name) {
  const storageKey = `forms_${url}`;

  chrome.storage.sync.get([storageKey], (result) => {
    const savedForms = result[storageKey] || [];
    
    const newFormInstance = {
      id: `form-${Date.now()}`,
      timestamp: Date.now(),
      name: name, // Add the name here
      data: data
    };

    savedForms.push(newFormInstance);

    chrome.storage.sync.set({ [storageKey]: savedForms }, () => {
      console.log("Form data saved for", url);
    });
  });
} 
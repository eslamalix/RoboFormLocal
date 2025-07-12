document.addEventListener('DOMContentLoaded', () => {
  const formList = document.getElementById('form-list');
  const noFormsDiv = document.getElementById('no-forms');
  const saveButton = document.getElementById('save-form-button');
  const formNameInput = document.getElementById('form-name-input');
  const statusDiv = document.getElementById('status');

  let currentTab;

  // --- Functions ---

  function loadSavedForms(url) {
    const storageKey = `forms_${url}`;
    chrome.storage.sync.get([storageKey], (result) => {
      formList.innerHTML = ''; // Clear existing list
      const savedForms = result[storageKey];
      if (savedForms && savedForms.length > 0) {
        noFormsDiv.style.display = 'none';
        // Sort by timestamp descending
        savedForms.sort((a, b) => b.timestamp - a.timestamp);

        savedForms.forEach((formInstance) => {
          const listItem = document.createElement('li');
          // Use the name, or fall back to the timestamp
          listItem.textContent = formInstance.name || `Saved at: ${new Date(formInstance.timestamp).toLocaleString()}`;
          listItem.dataset.formId = formInstance.id;
          
          listItem.addEventListener('click', () => {
            chrome.tabs.sendMessage(currentTab.id, {
              action: 'fill_form',
              formData: formInstance.data
            }, (response) => {
              if (chrome.runtime.lastError) {
                console.error('Failed to fill form:', chrome.runtime.lastError.message);
                showStatus('Failed to fill form. Try refreshing the page.', true);
                return;
              }
              window.close();
            });
          });
          formList.appendChild(listItem);
        });
      } else {
        noFormsDiv.style.display = 'block';
      }
    });
  }

  function showStatus(message, isError = false) {
    statusDiv.style.display = 'block';
    statusDiv.style.color = isError ? 'red' : 'green';
    statusDiv.textContent = message;
    // Hide after 3 seconds
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }

  // --- Event Listeners ---

  saveButton.addEventListener('click', () => {
    // Basic guard
    if (!currentTab) return;

    // Check if the page supports content scripts
    if (currentTab.url.startsWith('chrome://') || 
        currentTab.url.startsWith('edge://') || 
        currentTab.url.startsWith('about:') ||
        currentTab.url.startsWith('moz-extension://') ||
        currentTab.url.startsWith('chrome-extension://') ||
        currentTab.url.startsWith('extension://')) {
      showStatus('Cannot save forms on this type of page.', true);
      return;
    }

    saveButton.disabled = true;
    showStatus('Saving...', false);

    chrome.tabs.sendMessage(currentTab.id, { action: 'get_form_data' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        showStatus('Could not access the page. Try refreshing the page.', true);
        saveButton.disabled = false;
        return;
      }
      if (response && response.formData && response.formData.length > 0) {
        // Send a message to the background script to save the data
        chrome.runtime.sendMessage({
          action: 'save_data',
          url: currentTab.url,
          data: response.formData,
          name: formNameInput.value || '' // Pass the name
        }, (response) => {
          if (chrome.runtime.lastError) {
            showStatus('Failed to save form data.', true);
            saveButton.disabled = false;
            return;
          }
          // Refresh the list after saving
          loadSavedForms(currentTab.url);
          formNameInput.value = ''; // Clear the input
          saveButton.disabled = false;
          showStatus('Form saved!', false);
        });
      } else {
        showStatus('No form found on the page to save.', true);
        saveButton.disabled = false;
      }
    });
  });

  // --- Initialization ---

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    currentTab = tabs[0];
    if (currentTab && currentTab.url) {
      loadSavedForms(currentTab.url);
    }
  });
}); 
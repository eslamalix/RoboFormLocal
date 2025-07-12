let rightClickedEl = null;

document.addEventListener("mousedown", (event) => {
  if (event.button === 2) { // right-click
    rightClickedEl = event.target;
  }
}, true);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "get_form_data") {
    // If saving from popup, rightClickedEl might be null.
    // Find the form based on the last right-clicked element,
    // or fall back to the first form on the page.
    const targetEl = rightClickedEl || document.body;
    const form = targetEl.closest("form");
    
    if (form) {
      const formData = serializeForm(form);
      sendResponse({ formData: formData });
    } else {
      // If no form is found near the click, try the first form on the page
      const firstForm = document.querySelector('form');
      if(firstForm){
        const formData = serializeForm(firstForm);
        sendResponse({ formData: formData });
      } else {
        sendResponse({ formData: null });
      }
    }
    // Reset after use to ensure the next popup save doesn't use an old target
    rightClickedEl = null; 
  } else if (request.action === "fill_form") {
    if (request.formData) {
      fillForm(request.formData);
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false });
    }
  }
  return true; // Indicates that the response is sent asynchronously
});

function serializeForm(form) {
  const formData = [];
  for (const element of form.elements) {
    if (element.name) {
      const type = element.type;
      let value = element.value;

      if (type === 'checkbox') {
        // Always save checkbox state
        formData.push({ 
          name: element.name, 
          value: element.value, 
          type: type, 
          checked: element.checked 
        });
      } else if (type === 'radio') {
        // Always save radio button state
        formData.push({ 
          name: element.name, 
          value: element.value, 
          type: type, 
          checked: element.checked 
        });
      } else if (type === 'select-one') {
        // Regular dropdown
        formData.push({ 
          name: element.name, 
          value: element.value, 
          type: type,
          selectedIndex: element.selectedIndex
        });
      } else if (type === 'select-multiple') {
        // Multi-select dropdown - save all selected options
        const selectedValues = [];
        for(const option of element.options){
          if(option.selected){
            selectedValues.push(option.value);
          }
        }
        formData.push({ 
          name: element.name, 
          value: selectedValues, 
          type: type 
        });
      } else {
        // Text inputs, textareas, etc.
        formData.push({ name: element.name, value: value, type: type });
      }
    }
  }
  return formData;
}

function fillForm(formData) {
  formData.forEach((field) => {
    const elements = document.getElementsByName(field.name);
    elements.forEach((element) => {
      if (element.type === field.type) {
        if (field.type === 'checkbox') {
          // Match by value and set checked state
          if(element.value === field.value){
            element.checked = field.checked;
          }
        } else if (field.type === 'radio') {
          // Match by value and set checked state
          if(element.value === field.value){
            element.checked = field.checked;
          }
        } else if (field.type === 'select-one') {
          // Regular dropdown
          element.value = field.value;
          if (field.selectedIndex !== undefined) {
            element.selectedIndex = field.selectedIndex;
          }
        } else if (field.type === 'select-multiple') {
          // Multi-select dropdown
          for(const option of element.options){
            option.selected = field.value.includes(option.value);
          }
        } else {
          // Text inputs, textareas, etc.
          element.value = field.value;
        }
      }
    });
  });
} 
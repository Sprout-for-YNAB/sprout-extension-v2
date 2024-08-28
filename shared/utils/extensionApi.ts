export const getNamespace = () => {
  return typeof browser !== "undefined" ? browser : chrome;
};

export const openSettings = () => {
  if (typeof browser !== "undefined") {
    browser.runtime.openOptionsPage().catch(reportError);
  } else {
    chrome.runtime.openOptionsPage();
  }
};

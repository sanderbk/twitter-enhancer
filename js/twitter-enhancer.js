/*
___________       .__  __    __                 ___________      .__                                      
\__    ___/_  _  _|__|/  |__/  |_  ___________  \_   _____/ ____ |  |__ _____    ____   ____  ___________ 
  |    |  \ \/ \/ /  \   __\   __\/ __ \_  __ \  |    __)_ /    \|  |  \\__  \  /    \_/ ___\/ __ \_  __ \
  |    |   \     /|  ||  |  |  | \  ___/|  | \/  |        \   |  \   Y  \/ __ \|   |  \  \__\  ___/|  | \/
  |____|    \/\_/ |__||__|  |__|  \___  >__|    /_______  /___|  /___|  (____  /___|  /\___  >___  >__|   
                                      \/                \/     \/     \/     \/     \/     \/    \/       
*/
document.addEventListener("DOMContentLoaded", () => {
  var noTwitter = false;

  var checkboxtwitt = document.getElementById("checkbox");
  var submitTwitter = document.getElementById("submitTwitt");

  var label = document.getElementById("idk");

  label.textContent = checkboxtwitt.noTwitter;

  var tab = null;

  chrome.tabs.query({ currentWindow: true, active: true }, function (tabArray) {
    tab = tabArray[0];
  });

  chrome.storage.local.get("noTwitter", (data) => {
    noTwitter = !!data.noTwitter;
    checkboxtwitt.checked = noTwitter;
  });

  submitTwitter.onclick = () => {
    if (checkboxtwitt.checked) {
      noTwitter = true;
      chrome.storage.local.set({ noTwitter: noTwitter });
      reloadTab();
    } else {
      noTwitter = false;
      chrome.storage.local.set({ noTwitter: noTwitter });
      reloadTab();
    }
  };

  function reloadTab() {
    const hostname = getDomain(tab.url);

    if (hostname === "twitter.com") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: doReload,
      });
    }
  }
  
  function doReload() {
    window.location.reload();
  }

  function getDomain(url, subdomain) {
    subdomain = subdomain || false;

    url = url.replace(/(https?:\/\/)?(www.)?/i, "");
    if (!subdomain) {
      url = url.split(".");
      url = url.slice(url.length - 2).join(".");
    }
    if (url.indexOf("/") !== -1) {
      return url.split("/")[0];
    }
    return url;
  }
});

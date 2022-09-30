/*
___________       .__  __    __                 ___________      .__                                      
\__    ___/_  _  _|__|/  |__/  |_  ___________  \_   _____/ ____ |  |__ _____    ____   ____  ___________ 
  |    |  \ \/ \/ /  \   __\   __\/ __ \_  __ \  |    __)_ /    \|  |  \\__  \  /    \_/ ___\/ __ \_  __ \
  |    |   \     /|  ||  |  |  | \  ___/|  | \/  |        \   |  \   Y  \/ __ \|   |  \  \__\  ___/|  | \/
  |____|    \/\_/ |__||__|  |__|  \___  >__|    /_______  /___|  /___|  (____  /___|  /\___  >___  >__|   
                                      \/                \/     \/     \/     \/     \/     \/    \/       
*/
let no_twitt = false;

chrome.storage.local.get("noTwitter", (data) => {
  console.log("noTwitter", data.noTwitter);
  no_twitt = data.noTwitter;
});

function removeForcedLogin() {
  document.documentElement.setAttribute("style", "overflow: auto !important;");
  const element = document.querySelector("#layers");
  element.remove();
}

function setHtmlScroll() {
  const html = document.documentElement;
  if (
    html.getAttribute("style").includes("overflow: hidden; margin-right: 17px;")
  ) {
    document.documentElement.setAttribute(
      "style",
      "overflow: auto !important;"
    );
  }
}

//Mutationwatcher for for login prompt
const callback = function (mutationsList, observerLogin) {
  for (const mutation of mutationsList) {
    if (no_twitt) {
      if (isset(() => mutation.target.childNodes[0].id)) {
        if (mutation.target.childNodes[0].id === "layers") {
          removeForcedLogin();
          setHtmlScroll();
          break;
        }
      }
    }
  }
};

const observerLogin = new MutationObserver(callback);
observerLogin.observe(document.body.childNodes[2].childNodes[0], {
  childList: true,
  subtree: true,
});

// Options for the observer (which mutations to observe)
const callbackHtml = (mutationList, observerScroll) => {
  for (const mutation of mutationList) {
    if (mutation.type === "attributes") {
      if (no_twitt) {
        console.log(`The ${mutation.attributeName} attribute was modified.`);
        setHtmlScroll();
      }
    }
  }
};

const observerScroll = new MutationObserver(callbackHtml);
observerScroll.observe(document.documentElement, {
  attributes: true,
});

function isset(accessor) {
  try {
    return accessor() !== undefined && accessor() !== null;
  } catch (e) {
    return false;
  }
}

(function(global) {
  chrome.runtime.onMessage.addListener(function(message, sender) {
    if (message.action === 'el-cs-init') {
      beginGlobalListen();
      chrome.runtime.sendMessage({ action: 'el-cs-init-complete' });
    }
  });

  function beginGlobalListen() {
    global.addEventListener('message', function(event) {
      var port, action
      console.log("content script: ");
      console.log(event);
      if (event.data.action === 'ea-port-setup') {
        port = event.ports[0];
        listenToPort(port);
      }
    });
  }

  function listenToPort(port) {
    port.postMessage({ action: 'ea-port-setup-complete' });
    // Listens to messages coming directly from background script
    chrome.runtime.onMessage.addListener(function(message, sender) {
      if (message.from === 'devtools') {
        port.postMessage(message);
      }
    });

    // Listens for messages coming from elemental-actions.js
    // and sends them to the background script with the current tabId
    port.onmessage = function(event) {
      var message = event.data;
      message.from = 'elemental-actions';
      chrome.runtime.sendMessage(message);
    };
  }
})(window);

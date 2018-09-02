var count = 0;

function addTweet(stream) {
  count += 1;

  var newIl = stream.children[0].children[count],
    newStream = document.createElement("div"),
    newOl = document.createElement("ol"),
    whiteSpace = document.createElement("div"),
    contin = document.getElementById("continue");

  if (newIl.childNodes[1].classList.contains('promoted-tweet') || newIl.classList.contains('has-recap')) {
    newIl = stream.children[0].children[count];
    count += 1;
  }

  var pixels = 300 + count * 50;

  // newStream.classList.add("stream");
  newStream.classList.add("katyhere");
  newOl.classList.add("stream-items", "js-navigable-stream");

  // this id is what twitter hooks into to load more tweets!
  // so don't add it back in!!
  // newOl.id = "stream-items-id";

  newOl.appendChild(newIl);
  newStream.appendChild(newOl);
  newStream.style.display = 'contents';

  whiteSpace.style.height = `${pixels}px`;
  newStream.appendChild(whiteSpace);

  contin.parentNode.insertBefore(newStream, contin);
}

function addContinueLink(stream) {
  var div = document.createElement("div"),
    contin = document.createElement("p"),
    text = document.createTextNode("continue?");

  contin.appendChild(text);
  contin.classList.add("lead");
  contin.addEventListener('click', function() { addTweet(stream); });

  div.appendChild(contin);
  div.id = "continue";
  stream.parentNode.insertBefore(div, stream);
}

function hideElementsByClass(className) {
  var divs = document.getElementsByClassName(className);
  for (var i=0; i<divs.length; i += 1) {
    divs[i].style.display='none';
  }
}

function initPage() {
  count = 0;
  
  var stream = document.getElementsByClassName('stream')[0];
  if (!stream) {
    console.warn("unable to find stream");
  } else {
    stream.classList.add("oldstream");
    stream.style.display = 'none';

    hideElementsByClass('trends');
    hideElementsByClass('flex-module');
    hideElementsByClass('SidebarCommonModules');

    addContinueLink(stream);
    addTweet(stream);
  }
}

// polling function brought to you by https://davidwalsh.name/javascript-polling

function poll(fn, timeout, interval) {
  interval = interval || 100;

  var endTime = Number(new Date()) + (timeout || 5000);

  var checkCondition = function (resolve, reject) {
    // If the condition is met, we're done! 
    var result = fn();
    if (result) {
      resolve(result);
    }
    // If the condition isn't met but the timeout hasn't elapsed, go again
    else if (Number(new Date()) < endTime) {
      setTimeout(checkCondition, interval, resolve, reject);
    }
    // Didn't match and too much time, reject!
    else {
      console.error('error: polling condition check timed out');
      reject(new Error('timed out for ' + fn + ': ' + arguments));
    }
  };

  return new Promise(checkCondition);
}

function pollStream() {
  if (count > 1) {
    poll(function () {
      return document.querySelectorAll('.oldstream').length === 0;
    }, 5000, 150)
      .then(function () {
        initPage();
      })
      .catch(function () {
        console.warn('plugin failure: loading timed out');
      });
  }
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg === 'url-update') {
      pollStream();
    }
});

// Commented this during testing. Found that the URL change which indicated also a state change would trigger the new
// stream.
//
// from https://stackoverflow.com/questions/2844565/is-there-a-javascript-jquery-dom-change-listener/39508954#39508954
// document.head.appendChild(document.createElement('script')).text = '(' +
//     function() {
//         // injected DOM script is not a content script anymore, 
//         // it can modify objects and functions of the page
//         var _pushState = history.pushState;
//         history.pushState = function(state, title, url) {
//             _pushState.call(this, state, title, url);
//             window.dispatchEvent(new CustomEvent('state-changed', {detail: state}));
//         };
//         this.remove();
//         // repeat the above for replaceState too
//     } + ')(); this.remove();'; // remove the DOM script element

// And here content script listens to our DOM script custom events
// window.addEventListener('state-changed', function(e) {
//     if (e.detail.hasOwnProperty('inOverlay')) {
//       console.log("don't do anything");
//     } else {
//       pollStream();
//     }
// });

initPage();

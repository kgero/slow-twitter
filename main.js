var count = 0;

function add_tweet(stream) {
  var new_il = stream.children[0].children[count];
  count++;
  if (new_il.childNodes[1].classList.contains('promoted-tweet')) {
    console.log('skip the promoted tweet!');
    new_il = stream.children[0].children[count];
    count++;
  }
  var new_stream = document.createElement("div");
  // new_stream.classList.add("stream");
  new_stream.classList.add("katyhere");
  var new_ol = document.createElement("ol");
  new_ol.classList.add("stream-items");
  new_ol.classList.add("js-navigable-stream");
  // this id is what twitter hooks into to load more tweets!
  // so don't add it back in!!
  // new_ol.id = "stream-items-id";
  new_ol.appendChild(new_il);
  new_stream.appendChild(new_ol);
  new_stream.style.display='contents';
  var white_space = document.createElement("div");
  var pixels = 300 + count*50;
  white_space.style.height=pixels.toString() + "px";
  new_stream.appendChild(white_space);
  var contin = document.getElementById("continue");
  contin.parentNode.insertBefore(new_stream, contin);
}

function add_continue(stream) {
  var div = document.createElement("div");
  var contin = document.createElement("p");
  var text = document.createTextNode("continue?");
  contin.appendChild(text);
  contin.classList.add("lead");
  contin.addEventListener('click', function() { add_tweet(stream); });
  div.appendChild(contin);
  div.id = "continue";
  stream.parentNode.insertBefore(div, stream);
}

function hide_by_class(classname) {
  var divs = document.getElementsByClassName(classname);
  for (var i=0; i<divs.length; i++) {
    divs[i].style.display='none';
  }
  console.log('hiding divs:', divs);
}

function run_on_page() {
  console.log('running on page!');
  
  var stream = document.getElementsByClassName('stream')[0];
  if (typeof stream === "undefined") { console.log("can't find the stream!!!"); }
  else { console.log('stream:', stream); }
  stream.classList.add("oldstream");
  stream.style.display='none';

  hide_by_class('trends');
  hide_by_class('flex-module');
  hide_by_class('SidebarCommonModules');

  add_continue(stream);
  add_tweet(stream);

}




// from https://stackoverflow.com/questions/2844565/is-there-a-javascript-jquery-dom-change-listener/39508954#39508954
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg === 'url-update') {
    console.log('url update!!!');
  }
});

window.addEventListener('hashchange', function(e) {
    console.log('URL hash changed', e);
});

window.addEventListener('popstate', function(e) {
    console.log('State changed', e);
});

document.head.appendChild(document.createElement('script')).text = '(' +
    function() {
        // injected DOM script is not a content script anymore, 
        // it can modify objects and functions of the page
        var _pushState = history.pushState;
        history.pushState = function(state, title, url) {
            _pushState.call(this, state, title, url);
            window.dispatchEvent(new CustomEvent('state-changed', {detail: state}));
        };
        // repeat the above for replaceState too
    } + ')(); this.remove();'; // remove the DOM script element

// And here content script listens to our DOM script custom events
window.addEventListener('state-changed', function(e) {
    console.log('History state changed', e.detail, location.hash);
    if (e.detail.hasOwnProperty('inOverlay')) { console.log("don't do anything"); }
    else { run_on_page(); }
});

run_on_page();


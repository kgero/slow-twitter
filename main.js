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
  if (!stream) {
    console.log("can't find the stream!!!")
  } else {
    stream.classList.add("oldstream");
    stream.style.display = 'none';

    hide_by_class('trends');
    hide_by_class('flex-module');
    hide_by_class('SidebarCommonModules');

    add_continue(stream);
    add_tweet(stream);
  }
}

// polling function brought to you by https://davidwalsh.name/javascript-polling

function poll(fn, timeout, interval) {
  var endTime = Number(new Date()) + (timeout || 2000);
  interval = interval || 100;

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
      reject(new Error('timed out for ' + fn + ': ' + arguments));
    }
  };

  return new Promise(checkCondition);
}

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
    if (e.detail.hasOwnProperty('inOverlay')) {
      console.log("don't do anything");
    } else {
      poll(function () {
        return document.querySelectorAll('.oldstream').length === 0;
      }, 3000, 150)
      .then(function () {
        run_on_page();
      })
      .catch(function () {
        console.warn('plugin failure: loading timed out')
      });
    }
});

run_on_page();

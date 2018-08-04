var count = 0;

function add_tweet() {
  var new_il = stream.children[0].children[count];
  count++;
  console.log('new_il', new_il);
  var new_stream = document.createElement("div");
  new_stream.classList.add("stream");
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
  console.log(new_stream);
  var contin = document.getElementById("continue");
  contin.parentNode.insertBefore(new_stream, contin);
  // stream.parentNode.insertBefore(new_stream, stream);
}

function add_continue() {
  var div = document.createElement("div");
  var contin = document.createElement("p");
  var text = document.createTextNode("continue?");
  contin.appendChild(text);
  console.log(contin);
  contin.classList.add("lead");
  contin.addEventListener('click', function() { add_tweet(); });
  div.appendChild(contin);
  div.id = "continue";
  stream.parentNode.insertBefore(div, stream);
}

function hide_by_class(classname) {
  var divs = document.getElementsByClassName(classname);
  for (var i=0; i<divs.length; i++) {
    divs[i].style.display='none';
  }
}

// var dash = document.getElementsByClassName('dashboard');
// for(var i = 0; i < dash.length; i++) { 
//   dash[i].style.display='none'
// }

hide_by_class('dashboard');
hide_by_class('SidebarCommonModules');


// var tweet = document.getElementsByClassName('tweet');
// for(var i = 1; i < tweet.length; i++) { 
//   tweet[i].style.display='none';
//   // tweet[i].style.marginBottom='200px';
//   // tweet[i].style.marginTop='200px';
// }

// var timeline = document.getElementById('timeline');
// timeline.style.display='none';

var stream = document.getElementsByClassName('stream')[0];
stream.classList.add("oldstream");
stream.style.display='none';

add_continue();
add_tweet();


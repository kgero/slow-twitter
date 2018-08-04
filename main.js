
var count = 0;

var dash = document.getElementsByClassName('dashboard');
for(var i = 0; i < dash.length; i++) { 
  dash[i].style.display='none'
}

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
console.log(stream);
console.log(stream.children[0]);
console.log(stream.children[0].children[0]);

new_il = stream.children[0].children[0];
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
console.log(new_stream);
stream.parentNode.insertBefore(new_stream, stream);



var dash = document.getElementsByClassName('dashboard');
for(var i = 0; i < dash.length; i++) { 
  dash[i].style.display='none'
}

var tweet = document.getElementsByClassName('tweet');
for(var i = 1; i < tweet.length; i++) { 
  tweet[i].style.display='none';
  // tweet[i].style.marginBottom='200px';
  // tweet[i].style.marginTop='200px';
}


var observer = new MutationObserver(function onMutationObserver(mutations) {
  mutations.forEach(function(mutationNode) {
    console.log("MUTATION!");
    var mutationAddedNodes = mutationNode.addedNodes;
    // No idea why the mutation API returns empty added mutations. Doesn't make
    // sense, oh well ...
    if (mutationAddedNodes && mutationAddedNodes.length > 0) {
      // for some reason deleting the end loading spinner causes failure...
      var end_loader = document.getElementsByClassName('stream-end-inner')[0];
      
      var tweet = document.getElementsByClassName('tweet');
      for(var i = 1; i < tweet.length; i++) { 
        tweet[i].style.display='none';
        // tweet[i].style.marginBottom='200px';
        // tweet[i].style.marginTop='200px';
      }
      var end_spinner = document.getElementsByClassName('spinner')[0];
      end_spinner.classList.remove("spinner");
    }
  });
});
var historyContainerDOM = document.getElementById('timeline');
observer.observe(historyContainerDOM, { childList: true, subtree: true });
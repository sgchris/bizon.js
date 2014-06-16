bizon.js
========

bizon.js - light weight images gallery implemented on vanilla JS (native)

usage:


HTML:
<div id="my-gallery">
  <img src="path-to-thumbnail.jpg" full-image-src="full-image.jpg" />
</div>


JS:
// start the gallery when DOM is ready. use native JS like:
document.addEventListener('DOMContentLoaded', function() {
  bizon(document.getElementById("my-gallery"));
});

// or using jquery
$(document).ready(function() {
  bizon(document.getElementById("my-gallery"));
});

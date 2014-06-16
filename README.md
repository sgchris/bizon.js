bizon.js
========

bizon.js - light weight images gallery implemented on vanilla JS (native)

usage:


```
HTML:
<div id="my-gallery">
  <img src="path-to-thumbnail1.jpg" full-image-src="full-image1.jpg" />
  <img src="path-to-thumbnail2.jpg" full-image-src="full-image2.jpg" />
  ...
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

```

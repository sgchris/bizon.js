bizon.js
========

bizon.js - light weight images gallery implemented on vanilla JS (native)

usage:


HTML:
```
<head>
	...
	<link rel="stylesheet" href="path/to/bizon.css" />
	...
</head>
<body>
...
<div id="my-gallery">
  <img src="path-to-thumbnail1.jpg" full-image-src="full-image1.jpg" />
  <img src="path-to-thumbnail2.jpg" full-image-src="full-image2.jpg" />
  ...
</div>
...
</body>

```

JS:
```
<script src="/path/to/bizon.js"></script>
...
...
<script>
// start the gallery when DOM is ready. use native JS like:
document.addEventListener('DOMContentLoaded', function() {
  bizon(document.getElementById("my-gallery"));
});

// or using jquery
$(document).ready(function() {
  bizon($("#my-gallery").get(0));
});
</script>
```

# Bizon.js v2.0

Bizon.js is a lightweight JavaScript library for displaying image galleries in a modern, responsive popup. This README provides installation instructions, usage examples, and customization options.

## Features
- 📷 **Image gallery in a popup**
- 🎨 **Customizable styles and captions**
- 🔄 **Lightweight and fast**
- 🖼️ **Supports thumbnails**
- 🔧 **Easy integration**

## Installation
### Option 1: Download
1. Download the latest version of `bizon2.js` and `bizon2.css`.
2. Place them in your project folder.

### Option 2: Use CDN *(if available)*
```html
<link rel="stylesheet" href="https://cdn.example.com/bizon2.css">
<script src="https://cdn.example.com/bizon2.js"></script>
```

## Usage
### Basic Example
Create a simple HTML page and integrate Bizon.js:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bizon.js v2.0 Demo</title>
    <link rel="stylesheet" href="bizon2.css">
</head>
<body>
    <h1>Bizon v2.0Alpha</h1>
    <h2>Display gallery in a popup</h2>
    <button id="openGallery">Open Gallery</button>

    <script src="bizon2.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const sampleImages = Array.from({ length: 10 }, (_, i) => ({
                src: `images/sample_${i + 1}.jpeg`,
                thumb: `images/sample_${i + 1}_thumb.jpeg`,
                caption: `Sample Image ${i + 1}`
            }));

            const gallery = new BizonGallery({
                title: "Sample Gallery",
                images: sampleImages,
                callbacks: {
                    onClose: () => console.log("Gallery closed")
                }
            });

            document.getElementById("openGallery").addEventListener("click", () => {
                gallery.show();
            });
        });
    </script>
</body>
</html>
```

## API Reference
### `new BizonGallery(options)`
Creates a new instance of BizonGallery.
#### **Options**
| Property    | Type       | Description |
|------------|-----------|-------------|
| `title`    | `string`  | The title of the gallery. |
| `images`   | `Array`   | Array of image objects with `src`, `thumb`, and `caption`. |
| `callbacks`| `Object`  | Optional event listeners such as `onClose`. |

### `gallery.show()`
Opens the image gallery.

### `gallery.hide()`
Closes the gallery.

## Customization
### Styling
You can customize the gallery's appearance by modifying `bizon2.css`.

### Event Listeners
```js
const gallery = new BizonGallery({
    images: [...],
    callbacks: {
        onClose: () => alert("Gallery closed")
    }
});
```

## License
MIT License.

## Contributing
Contributions are welcome! Please submit issues and pull requests on GitHub.



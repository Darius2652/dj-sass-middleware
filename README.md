## _SASS conversion made easy_

*SASS Middleware* is a simple, automated solution to working with SASS files with express.

### Features

- Easily convert SASS or SCSS to CSS
- Re-calculates the CSS results with every request when in `NODE_ENV=development`
- Caches results in memory when on `NODE_ENV=production`
- Ability to return a normal or minified CSS file, depeding on the URL
- Ability to pass a variable map, so that you can easily get variables from your database to your stylesheets
- Easily flush SASS cache for individual or all routes

### Setup

```js
//       --- Standard Express setup ---

const express = require('expess');
const app = require('app');

//       --- The important bits ---

const sassMiddleware = require('@darius2652/sass-middleware')({
 // optional parameters, found below
});

app.use(sassMiddleware.Hook);

// Initialize sass-middleware before you add any routes or 
```

### Usage

In your `/sass` or `/scss` directory, create a respective `.sass` or `.scss` file. 
For this example I went with `/sass/my-file.sass`.

In the HEAD section of your website, you can now link to this file with two methods, depending on your desired output:

```html
<!-- Normal CSS output -->

<link href="stylesheet" href="/css/my-file.css">

<!-- Minified output -->

<link href="stylesheet" href="/css/my-file.min.css">
```

### Optional Parameters

| Parameter      | Use                                                                                                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| source         | The folder where .sass or .scss files will be located. Defaults to `/sass` or `/scss` in your root directory                                                                             |
| variableMap    | A JSON object containing key-value pairs which will be passed to the SASS compiler. Automatically prepended with `$`. <br /> Use `!default` to initialize values in the sass/scss files. |
| forceMinifed   | Always return minified CSS, regardless of wheter `.min` was added to the URL                                                                                                             |
| mode           | Select between `sass` or `scss`. This will change the default source folder, the syntax used and the file extension the compiler searches for                                            |
| exposePartials | Whether to allow directly linking to files that have an underscore "\_" in front of the file name (normally used for [*partial*](https://sass-lang.com/guide#topic-4) files)             |
| debug          | One of three methods which can be called from within a sass or scss file, for debugging purposes.                                                                                        |
| warn           | One of three methods which can be called from within a sass or scss file, for debugging purposes.                                                                                        |
| error          | One of three methods which can be called from within a sass or scss file, for debugging purposes.                                                                                        |


### Variables
In the example file, I have added the following variables to the `variableMap` parameter:
```json
{
	"color-background": "#444",
 	"color-primary": "#00AAFF",
 	"header-size": "3em",
}
```
Using these variables (as can be seen in the example file `my-file.sass`), this is the output:

![Variables Example Image](https://raw.githubusercontent.com/Darius2652/dj-sass-middleware/live/examples/example.jpg)

### Methods

**Flush Cache**
In production, it might be necessary to flush the cache of your SASS files without reloading the server. This will be necessary if your `variableMap` values change at any point.

Cache can be flushed for *all* generated SASS files, 

Flushing can be called in two ways:
- `SassMiddleware.Flush()`
- In an express route, `req.flushSass()`

### Installation

```sh

npm i -s @darius2652/sass-middleware

```

## License

MIT
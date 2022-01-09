## _SASS conversion made easy_

*SASS Middleware* is a simple, automated solution to working with SASS files with express.

### Setup

```js

const express = require('expess');

const sassMiddleware = require('@darius2652/sass-middleware')({

 // optional parameters

});

express.use(sassMiddleware.Hook);
```

### Usage

In your `/sass` or `/scss` directory, create a respective `.sass` or `.scss` file. 
For this example that I went with `/sass/my-file.sass`.

In the HEAD section of your website, you can now link to this file with two methods, depending on your desired output:

```html
<!-- Normal format -->

<link href="stylesheet" src="/css/my-file.css">

<!-- Minified format (Just change .css to .min.css) -->

<link href="stylesheet" src="/css/my-file.min.css">
```

### Optional Parameters

| Parameter    | Use                                                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| source       | The folder where SASS or SCSS files will be located. Defaults to `/sass` or `/scss` in your root directory.          |
| variableMap  | A JSON object containing key-value pairs which will be passed to the SASS compiler. Automatically prepended with `$` |
| forceMinifed | Always return minified CSS, regardless of wheter `.min` was added to the URL                                         |
| mode         | Select between `sass` or `scss`. This will change which source folder, syntax and file extension will be used        |
|              | More customization features will be added in the future                                                              |

## Features

- Easily convert SASS or SCSS to CSS
- Re-calculates with every request when in `NODE_ENV=development`
- Caches results on `NODE_ENV=production`
- Ability to return a normal or minified CSS file, depeding on the URL
- Ability to pass a variable map, so that you can easily get variables from your database to your stylesheets
- Easily flush SASS cache for individual or all routes

### Installation:

```sh

npm i -s @darius2652/sass-middleware

```

## License

MIT
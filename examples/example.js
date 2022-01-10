const express = require('express');
const path = require('path');
const app = express();

const SassMiddleware = require('../index')({
  mode: 'sass',
  forceMinified: false,
  source: path.join(__dirname, 'sass'),
  variableMap: {
    'color-background': '#444',
    'color-primary': '#00AAFF',
    'header-size': '3em',
  }
});

SassMiddleware.Hook(app);

app.get('/', (req, res) => {

  // I don't recommend serving HTML like this, it's just for the purpose of this example :)

  return res.send(`
    <html>
      <head>
        <link rel="stylesheet" href="/css/my-file.css">
      </head>
      <body>
        <h1>Hello World!</h1>
      </body>
    </html>`
  );
})

app.listen(8080, () => {console.log(`SASS middleware example listening on port 8080`)});
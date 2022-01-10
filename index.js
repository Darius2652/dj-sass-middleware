const path    = require('path'),
      fs      = require('fs'),
      nsass   = require('node-sass'),
      express = require('express');

let pathResults = {};
const cache = process.env.NODE_ENV == 'production';

const other_types = ['scss'];

class SassMiddleware {
  constructor (options) {
    let {source, variableMap, forceMinified, mode, exposePartials, debug, warn, error} = options;

    this.Mode = (other_types.indexOf(mode) > -1) ? mode : 'sass';
    this.SourceDir = source || path.join(__dirname, '../../../'+this.Mode);
    this.ForceMinified = !!forceMinified;
    this.VariableMap = (variableMap && typeof variableMap == 'object') ? variableMap : {};
    this.ExposePartials = !!exposePartials;
    this.DebugMethod = sassString => {
      let value = sassString.getValue();
      return ((debug && typeof debug == 'function') ? debug : console.debug)(value);
    }
    this.WarnMethod = sassString => {
      let value = sassString.getValue();
      return ((warn && typeof warn == 'function') ? warn : console.warn)(value);
    }
    this.ErrorMethod = sassString => {
      let value = sassString.getValue();
      return ((error && typeof error == 'function') ? error : console.error)(value);
    }
  }

  Flush(path) {
    if(path && pathResults[path]) {
      delete pathResults[path];
      return this;
    }
    pathResults = {};
    return this;
  }

  Hook(router) {
    router.use((req, res, next) => {
      res.css = () => {
        return res.type('css').send(pathResults[req.path]);
      }
      req.flushSass = () => {
        this.Flush(req.path);
      }
      next();
    })
    
    router.get('/css/*.css', (req, res, next) => {
      if(cache && pathResults[req.path]) return res.css();
    
      let rpath = req.path.replace('/css', '');
      let requestedFilename = rpath.match(/[^\\\/\s]+\.(min\.)?css$/)?.[0];

      if(!this.ExposePartials && requestedFilename?.indexOf('_') == 0) return next();
    
      let outputStyle = 'nested';
      if(this.ForceMinified || rpath.match(/\.min\.css$/)) {
        outputStyle = 'compressed';
        rpath = rpath.replace(/\.min\.css$/, '.css');
      };
    
      let sassFolder = this.SourceDir;
      let sassPath = path.join(sassFolder, rpath.replace(/\.css/g, this.Mode == 'scss' ? '.scss' : '.sass'));
      if(!fs.existsSync(sassPath)) {
        return next();
      }
    
      let sass = fs.readFileSync(sassPath, 'utf-8');

      let _endLine = this.Mode == 'scss' ? ';' : '';
      let _prepend = Object.keys(this.VariableMap).map(key => `$${key}: ${this.VariableMap[key]}${_endLine}`).join('\r\n') + '\r\n';
    
      let css = nsass.renderSync({
        data: _prepend + sass,
        includePaths: [
          sassFolder,
        ],
        functions: {
          '@debug': this.DebugMethod,
          '@error': this.ErrorMethod,
          '@warn': this.WarnMethod,
        },
        indentedSyntax: this.Mode !== 'scss',
        outputStyle
      }).css
    
      pathResults[req.path] = css;
    
      return res.css();
    })
  }
}

/**
 * Initialize SASS Middleware
 *
 * @param {Object} optionalParameters
 * @param {string} optionalParameters.source The folder where sass or scss directory will be located. Defaults to `/sass` or `/scss` in your root directory
 * 
 * **Default**: Project root directory
 * @param {("sass"|"scss")} optionalParameters.mode Select between *'sass'* or *'scss'*. This will change which source folder, syntax and file extension will be used.
 * 
 * **Default**: `sass`
 * @param {Object.<string, *>} optionalParameters.variableMap A JSON object containing key-value pairs which will be passed to the SASS compiler. Automatically prepended with `$`
 * @param {boolean} optionalParameters.forceMinified If `true`, the compiler will always return minified CSS, regardless of wheter *.min* was added to the URL
 * 
 * **Default**: `false`
 * @param {boolean} optionalParameters.exposePartials Whether to allow directly linking to files that have an underscore "\_" in front of the file name (normally used for [*partial*](https://sass-lang.com/guide#topic-4) files)
 * 
 * **Default**: `false`
 * @param {function(string): undefined} optionalParameters.debug One of three methods which can be called from within a sass or scss file, for debugging purposes.
 * **debug**, warn, error
 * 
 * *Usage in SASS/SCSS file:*
 * `@debug "Output here"`
 * 
 * **Default**: `console.debug`
 * @param {function(string): undefined} optionalParameters.warn One of three methods which can be called from within a sass or scss file, for debugging purposes.
 * debug, **warn**, error
 * 
 * *Usage in SASS/SCSS file:*
 * `@warn "Output here"`
 * 
 * **Default**: `console.warn`
 * @param {function(string): undefined} optionalParameters.error One of three methods which can be called from within a sass or scss file, for debugging purposes.
 * debug, warn, **error**
 * 
 * *Usage in SASS/SCSS file:*
 * `@error "Output here"`
 * 
 * **Default**: `console.error`
 */
module.exports = (optionalParameters = {source, variableMap, forceMinified, mode, exposePartials, debug, warn, error} = {}) => new SassMiddleware(optionalParameters);
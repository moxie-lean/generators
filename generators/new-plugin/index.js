var generators = require('yeoman-generator');
var mkdirp = require('mkdirp');
var rimraf = require( 'rimraf' );
var fs = require('fs');
var replace = require('replace');
var merge = require('merge');

module.exports = generators.Base.extend({

  initializing: function () {
    this.THEME_FOLDER = './wp-content/themes/';
    this.PLUGIN_GIT_URI = 'git@github.com:moxie-leean/wp-plugin.git';
  },

  prompts: function() {
    var done = this.async();

    var questions = [
      {
        name: 'name',
        message: 'The name of this project',
        default: this.destinationRoot().split('/').pop(),
        validate: function( input ) {
          return input.trim() !== '';
        }
      }
    ];
    this.prompt(questions, function(answers) {
      this.name = answers.name.toLowerCase().trim().replace(/\s/g, '-');
      done();
    }.bind(this));
  },

  writing: function() {
    this.THEME_FOLDER += this.name;
    console.log('Creating theme in ' + this.THEME_FOLDER);

    if ( fs.existsSync(this.THEME_FOLDER) ) {
      if( fs.readdirSync(this.THEME_FOLDER).length ) {
        console.log('The theme folder already has some files!');
        done();
        return;
      }
    } else {
      console.log('Creating the folder first');
      mkdirp.sync(this.THEME_FOLDER);
    }

    process.chdir( this.THEME_FOLDER );

    this._downloadPlugin();

    this._replaceInPlugin();
  },

  _downloadPlugin: function() {
    console.log('Downloading plugin files...');

    this.spawnCommandSync('git', ['clone', '--depth=1', this.PLUGIN_GIT_URI, '.']);

    rimraf('.git', function(err) {
      if (err) {
        console.log(err);
      }
    });
  },

  _replaceInPlugin: function() {
    console.log('Updating namespaces and constants...');

    var settings = {
      paths: ['.'],
      recursive: true,
      silent: true
    };

    var capitalizedName = this.name.replace(/-/g, ' ')
      .replace( /\b\w/g, function (m) {
        return m.toUpperCase();
      })
      .replace(/\s/g, '');
    replace( merge({
      regex: 'Leanp',
      replacement: capitalizedName
    }, settings) );

    var uppercaseName = this.name.replace(/\W+/g, '').toUpperCase();
    replace( merge({
      regex: 'LEANP',
      replacement: uppercaseName
    }, settings) );

    var lowercaseName = this.name.replace(/\W+/g, '').toLowerCase();
    replace( merge({
      regex: 'leanp',
      replacement: lowercaseName
    }, settings) );
  },

  install: function() {
    this.spawnCommandSync('composer', ['update']);
  }
});

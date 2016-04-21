require('../../shared/string');
var shared = require('../../shared/functions');
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
        default: shared.getBasename( this.destinationRoot() ),
        validate: function( input ) {
          return !input.isEmpty();
        }
      }
    ];
    this.prompt(questions, function(answers) {
      this.name = answers.name.toLowerHyphenated();
      done();
    }.bind(this));
  },

  writing: function() {
    this.THEME_FOLDER += this.name;
    console.log('Creating theme in ' + this.THEME_FOLDER);

    if ( fs.existsSync(this.THEME_FOLDER) ) {
      if( fs.readdirSync(this.THEME_FOLDER).length ) {
        console.log('The theme folder already has some files!');
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
console.log(this.name.toCapitalizeUnhyphenated());
    replace( merge({
      regex: 'Leanp',
      replacement: this.name.toCapitalizeUnhyphenated()
    }, settings) );

    replace( merge({
      regex: 'LEANP',
      replacement: this.name.toUpperCaseUnhyphenated()
    }, settings) );

    replace( merge({
      regex: 'leanp',
      replacement: this.name.toLowerCaseUnhyphenated()
    }, settings) );

    replace( merge({
      regex: 'lean-p',
      replacement: this.name
    }, settings) );
  },

  install: function() {
    this.spawnCommandSync('composer', ['update']);
  }
});

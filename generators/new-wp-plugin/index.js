require('../../shared/string');
var shared = require('../../shared/functions');
var generators = require('yeoman-generator');
var mkdirp = require('mkdirp');
var rimraf = require( 'rimraf' );
var fs = require('fs');
var replace = require('replace');
var merge = require('merge');
var chalk = require('chalk');

module.exports = generators.Base.extend({

  initializing: function () {
    this.PLUGIN_FOLDER = this.destinationRoot() + '/wp-content/plugins/';
    this.PLUGIN_GIT_URI = 'git@github.com:moxie-lean/wp-plugin.git';
  },

  prompts: function() {
    var done = this.async();

    var questions = [
      {
        name: 'name',
        message: 'Name of the plugin',
        default: shared.getBasename( this.destinationRoot() ),
        validate: function( input ) {
          return !input.isEmpty();
        }
      }
    ];
    this.prompt(questions, function(answers) {
      this.name = answers.name.cleanProjectName();
      done();
    }.bind(this));
  },

  writing: function() {
    this.PLUGIN_FOLDER += this.name;
    console.log('Creating theme in ' + this.PLUGIN_FOLDER);

    if ( fs.existsSync(this.PLUGIN_FOLDER) ) {
      if( fs.readdirSync(this.PLUGIN_FOLDER).length ) {
        console.log('The plugin folder already exists!');
        return;
      }
    } else {
      console.log('Creating the folder first');
      mkdirp.sync(this.PLUGIN_FOLDER);
    }

    process.chdir( this.PLUGIN_FOLDER );

    this._downloadPlugin();
    this._replaceInPlugin();
  },

  _downloadPlugin: function() {
    console.log('Downloading plugin files...');

    this.spawnCommandSync('git', ['clone', '--depth=1', this.PLUGIN_GIT_URI, '.']);

    console.log('Cleaning up Git folder...');

    this.spawnCommandSync('rm', ['-rf', '.git']);
  },

  _replaceInPlugin: function() {
    console.log('Updating namespaces and constants...');

    var settings = {
      paths: ['.'],
      recursive: true,
      silent: true
    };

    replace( merge({
      regex: 'Leanp',
      replacement: this.name.capitalizeAtHyphens()
    }, settings) );

    replace( merge({
      regex: 'LEANP',
      replacement: this.name.removeNonWordChars().toUpperCase()
    }, settings) );

    replace( merge({
      regex: 'leanp',
      replacement: this.name.removeNonWordChars().toLowerCase()
    }, settings) );

    replace( merge({
      regex: 'lean-p',
      replacement: this.name
    }, settings) );
  },

  install: function() {
    process.chdir( this.PLUGIN_FOLDER );

    this.spawnCommandSync('composer', ['update']);
  },

  end: function(){
    console.log( chalk.blue('Moving CI and other templates to the root...') );
    process.chdir('./../../../');
    fs.renameSync(`${this.PLUGIN_FOLDER}/.github`, './.github');
    fs.renameSync(`${this.PLUGIN_FOLDER}/.travis.yml`, './.travis.yml');
    console.log( chalk.green('Completed!') );
  }
});

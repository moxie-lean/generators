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
    console.log( chalk.blue('Creating plugin in ' + this.PLUGIN_FOLDER ) );

    if ( fs.existsSync(this.PLUGIN_FOLDER) ) {
      if( fs.readdirSync(this.PLUGIN_FOLDER).length ) {
        console.log( chalk.red('The plugin folder already exists!\n') );
        return;
      }
    } else {
      mkdirp.sync(this.PLUGIN_FOLDER);
    }

    process.chdir( this.PLUGIN_FOLDER );

    console.log( chalk.green('Completed!\n') );
    this._downloadPlugin();
    this._replaceInPlugin();
  },

  _downloadPlugin: function() {
    console.log( chalk.blue('Downloading plugin files...') );

    this.spawnCommandSync('git', ['clone', '--depth=1', this.PLUGIN_GIT_URI, '.']);
    this.spawnCommandSync('rm', ['-rf', '.git']);

    console.log( chalk.green('Completed!\n') );
  },

  _replaceInPlugin: function() {
    console.log( chalk.blue('Updating namespaces and constants...') );

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
    console.log( chalk.green('Completed!\n') );
  },

  install: function() {
    process.chdir( this.PLUGIN_FOLDER );

    if ( fs.existsSync('./vendor') ) {
      console.log( chalk.red('Composer has alredy been installed\n') );
    } else {
      this.spawnCommandSync('composer', ['install']);
      this.spawnCommandSync('composer', ['update']);
      console.log( chalk.green('Completed!\n') );
    }
i  },
});

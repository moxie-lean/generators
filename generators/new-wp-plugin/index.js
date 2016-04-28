require('../../shared/string');
var shared = require('../../shared/functions');
var generators = require('yeoman-generator');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var fs = require('fs');
var replace = require('replace');
var merge = require('merge');

module.exports = generators.Base.extend({

  initializing: function() {
    this.PLUGIN_FOLDER = this.destinationRoot() + '/wp-content/plugins/';
    this.PLUGIN_GIT_URI = 'git@github.com:moxie-leean/wp-plugin.git';
  },

  prompts: function() {
    var done = this.async();

    this.name = this.options.name !== undefined ? this.options.name.cleanProjectName() : undefined;

    var questions = [
      {
        name: 'name',
        message: 'The name of the plugin',
        default: shared.getBasename(this.destinationRoot()),
        validate: function(input) {
          return !input.isEmpty();
        },
        when: function() {
          return this.name === undefined;
        }.bind(this)
      }
    ];

    this.prompt(questions, function(answers) {
      this.name = this.name === undefined ? answers.name.cleanProjectName() : this.name;
      done();
    }.bind(this));
  },

  writing: function() {
    this.PLUGIN_FOLDER += this.name;
    console.log('Creating plugin in ' + this.PLUGIN_FOLDER);

    if (fs.existsSync(this.PLUGIN_FOLDER)) {
      if (fs.readdirSync(this.PLUGIN_FOLDER).length) {
        console.log('The theme folder already has some files!');
        return;
      }
    } else {
      console.log('Creating the folder first');
      mkdirp.sync(this.PLUGIN_FOLDER);
    }

    process.chdir(this.PLUGIN_FOLDER);

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

    replace(merge({
      regex: 'Leanp',
      replacement: this.name.capitalizeAtHyphens()
    }, settings));

    replace(merge({
      regex: 'LEANP',
      replacement: this.name.removeNonWordChars().toUpperCase()
    }, settings));

    replace(merge({
      regex: 'leanp',
      replacement: this.name.removeNonWordChars().toLowerCase()
    }, settings));

    replace(merge({
      regex: 'lean-p',
      replacement: this.name
    }, settings));
  },

  install: function() {
    process.chdir(this.PLUGIN_FOLDER);

    this.spawnCommandSync('composer', ['update']);
  },

  end: function() {
    console.log('** The plugin is all set! **')
  }
});

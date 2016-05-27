require('../../shared/string');
var shared = require('../../shared/functions');
var generators = require('yeoman-generator');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var fs = require('fs');
var replace = require('replace');
var merge = require('merge');

module.exports = generators.Base.extend({

  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  initializing: function() {
    this.PLUGIN_FOLDER = this.destinationRoot() + '/wp-content/plugins/';
    this.PLUGIN_GIT_URI = 'git@github.com:moxie-lean/wp-plugin.git';
    this.options.projectName = this.options.projectName || '';
  },

  prompts: function() {
    if ( this.options.projectName ) {
      this.projectName = this.options.projectName.cleanProjectName();
    } else {
      var done = this.async();
      var questions = [{
        name: 'projectName',
        message: 'The name of the plugin',
        default: shared.getBasename(this.destinationRoot()),
        validate: function(input) {
          return !input.isEmpty();
        },
      }];
      this.prompt(questions, function(answers) {
        this.projectName = answers.projectName.cleanProjectName();
        done();
      }.bind(this));
    }
  },

  writing: function() {
    this.PLUGIN_FOLDER += this.projectName;
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
      replacement: this.projectName.capitalizeAtHyphens()
    }, settings));

    replace(merge({
      regex: 'LEANP',
      replacement: this.projectName.removeNonWordChars().toUpperCase()
    }, settings));

    replace(merge({
      regex: 'leanp',
      replacement: this.projectName.removeNonWordChars().toLowerCase()
    }, settings));

    replace(merge({
      regex: 'lean-p',
      replacement: this.projectName
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

require('../../shared/string');
var shared = require('../../shared/functions');
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  initializing: function () {
    this.options.projectName = this.options.projectName || '';
    this.options.repo = '';
  },

  prompts: function() {
    var done = this.async();
    var questions = [];
    if ( ! this.options.projectName ) {
      questions.push({
        name: 'projectName',
        message: 'The name of the project',
        default: shared.getBasename( this.destinationRoot() ),
        validate: function( input ) {
          return !input.isEmpty();
        }
      });
    }

    questions.push({
      name: 'repo',
      message: 'The project repo uri (leave blank to skip github/bitbucket setup-up)',
      default: '',
      validate: function( input ) {
        return input.isEmpty() || input.isValidRepo();
      }
    });

    this.prompt(questions, (answers) => {
      this.projectName = answers.name ? answers.name.cleanProjectName() : this.options.projectName.cleanProjectName();
      this.repo = answers.repo;
      done();
    });
  },

  writing: function() {
    process.chdir( this.destinationRoot() );

    this.fs.copyTpl(
      this.templatePath('composer.json'),
      this.destinationPath('./composer.json'),
      { project_name: this.projectName }
    );

    this.fs.copyTpl(
      this.templatePath('travis.yml'),
      this.destinationPath('./.travis.yml'),
      { project_name: this.projectName }
    );

    this.fs.copyTpl(
      this.templatePath('gitignore'),
      this.destinationPath('./.gitignore'),
      { project_name: this.projectName }
    );
  },

  install: function() {
    process.chdir( this.destinationRoot() );

    if( this.repo ) {
      this.spawnCommandSync('git', ['init']);
      this.spawnCommandSync('git', ['add', '.']);
      this.spawnCommandSync('git', ['commit', '-m', 'Initial commit', '--quiet']);
      this.spawnCommandSync('git', ['remote', 'add', 'origin', this.repo]);
      this.spawnCommandSync('git', ['push', '-u', 'origin', 'master']);
      this.spawnCommandSync('git', ['checkout', '-b', 'develop']);
      this.spawnCommandSync('git', ['push', '--set-upstream', 'origin', 'develop']);
    }
  },

  end: function() {
    console.log('** The project is ready to roll! **')
  }
});

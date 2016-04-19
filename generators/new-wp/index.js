var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

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
      },
      {
        name: 'repo',
        message: 'The project repo uri (set it up in GitHub/Bitbucket first!)',
        validate: function( input ) {
          return input.indexOf('github.com') > -1 || input.indexOf('bitbucket.org') > -1;
        }
      }
    ];
    this.prompt(questions, function(answers) {
      this.name = answers.name.toLowerCase().trim().replace(/\s/g, '-');
      this.repo = answers.repo;
      done();
    }.bind(this));
  },

  writing: function() {
    this.fs.copyTpl(
      this.templatePath('composer.json'),
      this.destinationPath('./composer.json'),
      {
        name: this.name
      }
    );

    this.fs.copyTpl(
      this.templatePath('.travis.yml'),
      this.destinationPath('./.travis.yml'),
      {
        name: this.name
      }
    );

    this.fs.copyTpl(
      this.templatePath('.gitignore'),
      this.destinationPath('./.gitignore'),
      {
        name: this.name
      }
    );
  },

  install: function() {
    this.spawnCommandSync('git', ['init']);
    this.spawnCommandSync('git', ['add', '--all']);
    this.spawnCommandSync('git', ['commit', '-m', 'Initial commit', '--quiet']);
    this.spawnCommandSync('git', ['remote', 'add', 'origin', this.repo]);
    this.spawnCommandSync('git', ['push', '-u', 'origin', 'master']);
    this.spawnCommandSync('git', ['checkout', '-b', 'develop']);
    this.spawnCommandSync('git', ['push', '--set-upstream', 'origin', 'develop']);
  }
});

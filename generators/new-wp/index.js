var generators = require('yeoman-generator');

var defaultValue = function() {
  return '';
}

var createKeywords = function(str) {
  return str
    .split(',')
    .map(function(s) {
      return s.trim();
    })
    .filter(function(s) {
      return s && s.length > 0;
    });
};

module.exports = generators.Base.extend({
  prompts: function() {
    var done = this.async();

    var questions = [
      {
        name: 'name',
        message: 'The name of this project',
        default: defaultValue
      }
    ];
    this.prompt(questions, function(answers) {
      this.name = answers.name.toLowerCase().trim().replace(/\s/g, '-');
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
  }
});

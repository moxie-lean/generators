require('../../shared/string');
var shared = require('../../shared/functions');
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

  prompts: function() {
    var done = this.async();
    var questions = [
      {
        name: 'name',
        message: 'The name of the project',
        default: shared.getBasename( this.destinationRoot() ),
        validate: function( input ) {
          return !input.isEmpty();
        }
      }
    ];

    this.prompt(questions, (answers) => {
      this.projectName = answers.name.cleanProjectName();
      done();
    });
  },

  install: function() {
    var options = {
      options: { projectName: this.projectName }
    };
    this.composeWith('moxie-lean:new-wp-project', options);
    this.composeWith('moxie-lean:new-wp-plugin', options);
  }
});

require('../../shared/string');
var shared = require('../../shared/functions');
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

  prompts: function() {
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

    this.prompt(questions, function(answers) {
      this.name = answers.name.cleanProjectName();
      this._compose();
    }.bind(this));
  },

  _compose: function() {
    var options = { options: {
      name: this.name
    }};

    this.composeWith('moxie-lean:new-wp-project', options);
    this.composeWith('moxie-lean:new-wp-plugin', options);
  }
});

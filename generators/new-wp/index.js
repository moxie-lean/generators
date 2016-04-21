var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

  initializing: function () {
    this.composeWith('moxie-lean:new-wp-project');
    this.composeWith('moxie-lean:new-wp-plugin');
  }

});

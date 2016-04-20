var generators = require('yeoman-generator');
var yosay = require('yosay');

module.exports = generators.Base.extend({
  welcome: function(){
    var message = 'Welcome to the Lean generator. This is the list of some available generators.';
    this.log(yosay(message));
    this.log('Try to run: yo moxie-lean:<subcommand> to use any of this generators. List of subcommands');
    this.log('- php-lib');
    this.log('- new-wp');
    this.log();
  }
});

var generators = require('yeoman-generator');
var yosay = require('yosay');

module.exports = generators.Base.extend({
  welcome: function(){
    var message = 'Welcome to the Leean generator. This is the list of some avilable generators.';
    this.log(yosay(message));
    this.log('Try to run: yo leean-<subcommand> to use any of this generators. List of subcommands');
    this.log('- php-lib');
    this.log();
  }
});

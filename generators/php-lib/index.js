var generators = require('yeoman-generator');

var defaultValue = function(){
  return '';
}

var createKeywords = function( str ){
  return str
  .split(',')
  .map(function( s ){
    return s.trim();
  })
  .filter(function(s){
    return s && s.length > 0;
  });
};

module.exports = generators.Base.extend({
  prompts: function(){
    var done = this.async();

    var questions = [
      {
      name: 'name',
      message: 'Name for the library, use lowercase and replace spaces by - (dashes)',
      default: defaultValue
    },
    {
      name: 'description',
      message: 'Small description about this library',
      default: defaultValue
    },
    {
      name: 'keywords',
      message: 'Set of keywords for this library separated by a , (coma)',
      default: defaultValue
    },
    {
      name: 'homepage',
      message: 'URL of the repo or homepage of this library',
      default: defaultValue
    }
    ];
    this.prompt(questions, function(answers){
      this.name = answers.name.toLowerCase().trim().replace(/\s/g, '-');
      this.description = answers.name;
      this.keywords = createKeywords( answers.keywords );
      this.homepage = answers.homepage;
      done();
    }.bind(this));
  },
  writing: function(){
    this.fs.copyTpl(
      this.templatePath('composer.json'),
      this.destinationPath('./composer.json'),
      {
        name: this.name,
        description: this.name,
        keywords: this.keywords,
        homepage: this.homepage,
      }
    );
    this.fs.copy( this.templatePath('editorconfig'), './.editorconfig');
    this.fs.copy( this.templatePath('gitignore'), './.gitignore');
    this.fs.copy( this.templatePath('travis'), './.travis.yml');
    this.fs.copy( this.templatePath('codesniffer.ruleset.xml'), './codesniffer.ruleset.xml');
    this.fs.copy( this.templatePath('licence'), './licence');
    this.fs.copy( this.templatePath('src/Sample.php'), './src/Sample.php');
  },
});

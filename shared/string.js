String.prototype.isEmpty = function() {
  return this.trim() === '';
};

String.prototype.isBlankOrGitOrBit = function() {
  return /^$|github.com|bitbucket.org/g.test(this);
};

String.prototype.toLowerHyphenated = function() {
  return this.toLowerCase().trim().replace(/\s/g, '-');
};

String.prototype.toCapitalizeUnhyphenated = function() {
  return this.replace(/-/g, ' ')
    .replace(/\b\w/g, function(m) {
      return m.toUpperCase();
    })
    .replace(/\s/g, '');
};

String.prototype.toUpperCaseUnhyphenated = function() {
  return this.replace(/\W+/g, '').toUpperCase();
};

String.prototype.toLowerCaseUnhyphenated = function() {
  return this.replace(/\W+/g, '').toLowerCase();
};

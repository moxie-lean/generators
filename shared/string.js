/**
 * Is an empty string.
 * @returns {boolean}
 */
String.prototype.isEmpty = function() {
  return this.trim() === '';
};

/**
 * Is a valid repo uri (note just a simple test, could be made more sophisticated).
 * @returns {boolean}
 */
String.prototype.isValidRepo = function() {
  return /github.com|bitbucket.org/g.test(this);
};

/**
 * Cleans a project name (a valid name is lowercase separated with hyphens).
 * @returns {string}
 */
String.prototype.cleanProjectName = function() {
  return this.toLowerCase().trim().replace(/\s/g, '-');
};

/**
 * Capitalizes a string, treating a hyphen as the word separator.
 * @returns {string}
 */
String.prototype.capitalizeAtHyphens = function() {
  return this.replace(/-/g, ' ')
    .replace(/\b\w/g, function(m) {
      return m.toUpperCase();
    })
    .replace(/\s/g, '');
};

/**
 * Removes non-word characters.
 * @returns {string}
 */
String.prototype.removeNonWordChars = function() {
  return this.replace(/\W+/g, '');
};

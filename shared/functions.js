module.exports = {

  getBasename: function( path ) {
    return path.split('/').pop()
  }

};

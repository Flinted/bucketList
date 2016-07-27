var Ajax = function(){
this.response = ''
}

Ajax.prototype = {
  request: function(main){
    var url = 'https://restcountries.eu/rest/v1';
    var request = new XMLHttpRequest();
    request.open( "GET", url );
    request.onload = function(){

      if (request.status === 200){
        var jsonString = request.responseText;
        this.response = JSON.parse(jsonString);
        main(this.response);
      }
    }.bind(this)
    request.send( null );
  },

  return: function(){
    return this.response;
  }
}

module.exports = Ajax;

var View = require('./view/view.js');
var BucketList = require('./bucket_list/bucketList.js');

var state = {
  countries: [],
  view: new View(),
  bucketList: new BucketList(),
  latLng: {lat:51.4700,lng:-0.4543},
  map: '',
  markers: []
}

window.onload= function(){
  console.log('good so far');
  ajax();
}

var main = function(){
  state.view.initialise(state);
  state.view.populateCountries(state.countries);

}

var ajax = function(){
  var url = 'https://restcountries.eu/rest/v1';
  var request = new XMLHttpRequest();
  request.open( "GET", url );
  request.onload = function(){

    if (request.status === 200){
      var jsonString = request.responseText;
      state.countries = JSON.parse(jsonString);
      main();
    }
  }
  request.send( null );
}
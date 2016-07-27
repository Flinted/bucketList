/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);
	var BucketList = __webpack_require__(2);
	
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

/***/ },
/* 1 */
/***/ function(module, exports) {

	var View = function(){
	  state = '',
	  remId = ''
	}
	
	View.prototype={
	
	  initialise: function(state){
	    this.state = state
	    var addButton = document.getElementById('countryForm');
	    this.state.map = new google.maps.Map(document.getElementById('map'),{
	      center: this.state.latLng,
	      zoom: 2
	    })
	
	    addButton.onsubmit= function(e){
	      e.preventDefault();
	      var input = document.getElementById('countryDropdown').value
	      var request = new XMLHttpRequest();
	      request.open("POST","/bucketlist");
	      request.setRequestHeader('Content-Type', 'application/json');
	      request.onload = function(){
	        if (request.status === 200){
	
	        }
	      }
	      request.send(JSON.stringify(this.state.countries[input]))
	      this.refreshCountries();
	    }.bind(this)
	  },
	
	  populateCountries: function(countries){
	    console.log("countries")
	    var dropdown = document.getElementById('countryDropdown')
	    countries.forEach(function(country,index){
	      var opt = document.createElement('option');
	      opt.value = index;
	      opt.innerHTML= country.name;
	      dropdown.appendChild(opt);
	    })
	    this.refreshCountries();
	  },
	  
	  refreshCountries: function(){
	    var request = new XMLHttpRequest();
	    request.open("GET","/bucketlist");
	    request.setRequestHeader('Content-Type', 'application/json');
	    request.onload = function(){
	      if (request.status === 200){
	        this.state.bucketList.countries = JSON.parse(request.responseText)
	        this.updateView();
	      }
	    }.bind(this)
	    request.send(null);
	
	  },
	
	  updateView: function(){
	    // var request = new XMLHttpRequest();
	    // request.open("GET","/bucketlist");
	    // request.setRequestHeader('Content-Type', 'application/json');
	    // request.onload = function(){
	    //   if (request.status === 200){
	    //     this.state.countries = request.responseText
	    //   }
	    // }
	    // request.send(null);
	
	    var sideBar = document.getElementById('sidebar');
	    var bucketList = document.getElementById('bucketList');
	
	    bucketList.innerHTML=""
	    this.state.bucketList.countries.forEach(function(country){
	      var li = document.createElement('li');
	      li.innerHTML = country.name;
	
	      li.addEventListener('click', function(e){
	        this.state.bucketList.countries.forEach(function(country){
	          console.log(country.name, e.target.innerText)
	          if(country.name == e.target.innerText){
	            this.state.remId = country._id
	            console.log(this.state.remId)
	          }
	        }.bind(this))
	        var request = new XMLHttpRequest();
	
	        request.open("DELETE","/bucketlist/"+ this.state.remId);
	        request.setRequestHeader('Content-Type', 'application/json');
	        request.onload = function(){
	          if (request.status === 200){
	            this.state.bucketList.countries = JSON.parse(request.responseText)
	            this.updateView();
	          }
	        }.bind(this)
	        request.send(null);
	        this.state.bucketList.removeCountry(e.target.innerText)
	        bucketList.removeChild(e.target)
	
	      }.bind(this))
	      bucketList.appendChild(li);
	      this.addMarker(this.state, country);
	    }.bind(this))
	  },
	
	  addMarker: function(state,country){
	    console.log(country)
	    var coords= {lat: country.latlng[0], lng: country.latlng[1]}
	    var marker = new google.maps.Marker({
	      position: coords,
	      map: this.state.map
	    })
	    return marker;   
	  }
	  
	}
	
	
	module.exports = View;

/***/ },
/* 2 */
/***/ function(module, exports) {

	var BucketList = function(){
	  this.countries=[];
	};
	
	BucketList.prototype={
	  addCountry:function(country){
	    this.countries.push(country)
	  },
	  removeCountry: function(countryName){
	    this.countries.forEach(function(country,index){
	      if (country.name === countryName){
	        this.countries.splice(index,1)
	        return
	      }
	    }.bind(this))
	  }
	
	}
	
	module.exports = BucketList;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
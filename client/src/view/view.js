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
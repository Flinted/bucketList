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
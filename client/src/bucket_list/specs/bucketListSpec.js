var assert = require('assert');
var BucketList =  require('../bucketList');


describe('Bucket List', function(){
  beforeEach(function(){
    bucketList = new BucketList();
    country = {name: "Scotland", visited: false, cities:[{name:"Edinburgh", landmarks:[]},{name:"Glasgow", landmarks:[]}]}
  })

  it('should start empty', function(){
    assert.equal(0, bucketList.countries.length)
  })

  it('should add countries', function(){
    bucketList.addCountry(country);
    assert.equal(1, bucketList.countries.length)
    assert.equal("Scotland", bucketList.countries[0].name)
  })


  it('should remove countries', function(){
    bucketList.addCountry(country);
    bucketList.removeCountry("Scotland");
    assert.equal(0, bucketList.countries.length)
  })
})
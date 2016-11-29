var map = L.map('map').setView([50.736455137010665, -53.4375], 3);


var dark_base = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 10
})
map.addLayer(dark_base)

var gbif = L.tileLayer('http://api.gbif.org/v1/map/density/tile?x={x}&y={y}&z={z}', {
  attribution: '<a href="http://gbif.org">GBIF</a>',
  maxZoom: 10
})
map.addLayer(gbif)

$("#gbif_range").val(2016)

$("#gbif_range").change(function(){
  theYear = $(this).val()
  //figure out the right url
  theLayer = ""
  if (theYear <= 1900){
    theLayer += '&layer=OBS_PRE_1900'
  }
  if(theYear > 1900){
    theLayer += "&layer=OBS_1900_1910"
  }
  if(theYear > 1910){
    theLayer += "&layer=OBS_1910_1920"
  }
  if(theYear > 1920){
    theLayer += "&layer=OBS_1920_1930"
  }
  if(theYear > 1930){
    theLayer += "&layer=OBS_1930_1940"
  }
  if(theYear > 1940){
    theLayer += "&layer=OBS_1940_1950"
  }
  if(theYear > 1950){
    theLayer += "&layer=OBS_1950_1960"
  }
  if(theYear > 1960){
    theLayer += "&layer=OBS_1960_1970"
  }
  if(theYear > 1970){
    theLayer += "&layer=OBS_1970_1980"
  }
  if(theYear > 1980){
    theLayer += "&layer=OBS_1980_1990"
  }
  if(theYear > 1990){
    theLayer += "&layer=OBS_1990_2000"
  }
  if(theYear > 2000){
    theLayer += "&layer=OBS_2000_2010"
  }
  if(theYear > 2010){
    theLayer += "&layer=OBS_2010_2020&layer=OBS_NO_DATE"
  }
  map.removeLayer(gbif)
  layerTMS ="http://api.gbif.org/v1/map/density/tile?x={x}&y={y}&z={z}&layer=" + theLayer
  console.log(layerTMS)
  gbif = L.tileLayer(layerTMS, {
    attribution: '<a href="http://gbif.org">GBIF</a>',
      maxZoom: 10
  })
  map.addLayer(gbif)
})

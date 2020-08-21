//openview map
var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([37.41, 8.82]),
    zoom: 4
  })
});

//side-menu interaction
var ham=document.querySelector("#ham");
var shadow=document.querySelector("#shadow");
var menu=document.querySelector("#side_menu");
var close_btn=document.querySelector("#close_btn");
ham.addEventListener("click",function(){
  shadow.className = "show-shadow"; 
  menu.className = "show-menu"; 
});
close_btn.addEventListener("click",function(){
  shadow.className = "hide-shadow"; 
  menu.className = "hide-menu"; 
});

"use strict";
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
function load(){

}
var request = new XMLHttpRequest();
request.open("GET", "temp", false);
request.send(null)
var my_JSON_object = JSON.parse(request.responseText);
var height=my_JSON_object['json'][0]['header']['Nj'];
var width=my_JSON_object['json'][0]['header']['Ni'];
var [lo1,la1]=ol.proj.fromLonLat([my_JSON_object['json'][0]['header']['lo1'],my_JSON_object['json'][0]['header']['la1']])
var [lo2,la2]=ol.proj.fromLonLat([my_JSON_object['json'][0]['header']['lo2'],my_JSON_object['json'][0]['header']['la2']])
var dx = (lo2-lo1)/my_JSON_object['json'][0]['header']['Ni'], dy = (la2-la1)/my_JSON_object['json'][0]['header']['Nj'];
var zData = new Array(height);
for (var j = 0; j<height; j++){
    zData[j] = new Array(width);
    for (var i = 0; i<width; i++){
        zData[j][i] = my_JSON_object['json'][0]['data'][i + j*width];
    }
}
var geoTransform = [lo1,dx,0,la1,0,dy];
var intervalsZ = [-20,-15,-10,-5,0,5,10,15,20,25,30,25,30,35,40]
var styles2 = (function(){
    let r=[]
    for(let i=0;i<14;i++){
        r.push(new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'hsla('+(276+i*360/14)%360+', 100%, 50%, 1)',
            }),
        }))
    }
    return r
})()
var styleFunction2 = function (feature) {
    return styles[(feature.values_['0'].lowerValue+20)/5];
};
var styles1 = {
    'Point': new ol.style.Style({
        // image: image,
    }),
    'LineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'green',
            width: 1,
        }),
    }),
    'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'green',
            width: 2,
        }),
    }),
    'MultiPoint': new ol.style.Style({
        // image: image,
    }),
    'MultiPolygon': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'yellow',
            width: 1,
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 0, 0.1)',
        }),
    }),
    'Polygon': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'blue',
            lineDash: [4],
            width: 3,
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)',
        }),
    }),
    'GeometryCollection': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'magenta',
            width: 2,
        }),
        fill: new ol.style.Fill({
            color: 'magenta',
        }),
        image: new ol.style.Circle({
            radius: 10,
            fill: null,
            stroke: new ol.style.Stroke({
                color: 'magenta',
            }),
        }),
    }),
    'Circle': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 2,
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,0,0,0.2)',
        }),
    }),
  };
  var styles=styles2
  var styleFunction1 = function (feature) {
    return styles[feature.getGeometry().getType()];
  };
var linesZ= rastertools.isolines(zData, geoTransform, intervalsZ);
var styleFunction=styleFunction2
var box = {
  'type': 'FeatureCollection',
  'crs': {
      'type': 'name',
      'properties': {
          'name': 'EPSG:3857',
      },
  },
  'features': [
      {
          'type': 'Feature',
          'geometry': {
              'type': 'Polygon',
              'coordinates': [[[lo1, la1],[lo2, la1],[lo2, la2],[lo1, la2]]],
          },
      },
  ]
};
//openview map
var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(linesZ),
        }),
        style: styleFunction
    }),
    new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: geojson
        }),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgb(0, 150, 224)'
            })
        })
    }),
    new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(box),
        }),
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([32, 6]),
    zoom: 1
  })
});
function isobands(){
    console.log("isobands")
    linesZ= rastertools.isobands(zData, geoTransform, intervalsZ)
    styles=styles2
    styleFunction=styleFunction2
}
function isolines(){
    console.log("isolines")
    linesZ= rastertools.isolines(zData, geoTransform, intervalsZ)
    styles=styles1
    styleFunction=styleFunction1
}
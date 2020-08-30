"use strict";
var Circle = ol.geom.Circle,
    Feature = ol.Feature,
    GeoJSON = ol.format.GeoJSON,
    Map = ol.Map,
    View = ol.View,
    CircleStyle = ol.style.Circle,
    Fill = ol.style.Fill,
    Stroke = ol.style.Stroke,
    Style = ol.style.Style,
    OSM = ol.source.OSM,
    VectorSource = ol.source.Vector,
    Layer = ol.layer.Layer,
    TileLayer = ol.layer.Tile,
    VectorLayer = ol.layer.Vector,
    fromLonLat = ol.proj.fromLonLat;

var image = new CircleStyle({
    radius: 5,
    fill: null,
    stroke: new Stroke({color: 'red', width: 1}),
});

var styles = {
    'Point': new Style({
        image: image,
    }),
    'LineString': new Style({
        stroke: new Stroke({
            color: 'green',
            width: 1,
        }),
    }),
    'MultiLineString': new Style({
        stroke: new Stroke({
            color: 'green',
            width: 2,
        }),
    }),
    'MultiPoint': new Style({
        image: image,
    }),
    'MultiPolygon': new Style({
        stroke: new Stroke({
            color: 'yellow',
            width: 1,
        }),
        fill: new Fill({
            color: 'rgba(255, 255, 0, 0.1)',
        }),
    }),
    'Polygon': new Style({
        stroke: new Stroke({
            color: 'blue',
            lineDash: [4],
            width: 3,
        }),
        fill: new Fill({
            color: 'rgba(0, 0, 255, 0.1)',
        }),
    }),
    'GeometryCollection': new Style({
        stroke: new Stroke({
            color: 'magenta',
            width: 2,
        }),
        fill: new Fill({
            color: 'magenta',
        }),
        image: new CircleStyle({
            radius: 10,
            fill: null,
            stroke: new Stroke({
                color: 'magenta',
            }),
        }),
    }),
    'Circle': new Style({
        stroke: new Stroke({
            color: 'red',
            width: 2,
        }),
        fill: new Fill({
            color: 'rgba(255,0,0,0.2)',
        }),
    }),
};

var styleFunction = function (feature) {
    return styles[feature.getGeometry().getType()];
};
function view() {
    var f = window.frameElement;
    var w = (f) ? f : window;
    var d = document && document.documentElement;
    var b = document && document.getElementsByTagName("body")[0];
    var x = w.innerWidth || d.clientWidth || b.clientWidth;
    var y = w.innerHeight || d.clientHeight || b.clientHeight;
    return {width: x, height: y};
}
function array2D(data, Ni, Nj){
    var nData = new Array(Nj);
    for (let j=0; j<Nj; j++){
        nData[j] = new Array(Ni)
        for(let i=0; i<Ni; i++){
            nData[j][i] = data[j*Ni + i];
        }
    }
    return nData;
}
var dview = view()
console.log("view ", dview.width, dview.height);
d3.select(".map").attr("style", "width: "+ dview.width+"px; height: "+ dview.height+"px;");

d3.json(geojson, function(error, data){
    var header = data[0].header;
    var data = data[0].data;
    var λ0 = header.lo1, φ0 = header.la1; 
    var λ1 = header.lo2, φ1 = header.la2;
    var Ni = header.Ni, Nj = header.Nj;
    //
    var [x0, y0] = fromLonLat([λ0, φ0]);
    var [x1, y1] = fromLonLat([λ1, φ1]);
    var centre = [λ0+(λ1-λ0)/2, φ0+(φ1-φ0)/2];

    var dx = (x1-x0)/Ni, dy = (y1-y0)/Nj;
    var geoTransform = [x0, dx, 0, y0, 0, dy];
    var ndata = array2D(data, Ni, Nj);
    var intervals = [];
    for(let i=-20; i<=40; i+=2){ intervals.push(i)}
    var isolines = rastertools.isolines(ndata, geoTransform, intervals);
    console.log(isolines)
    var vectorSource1 = new VectorSource({
        features: new GeoJSON().readFeatures(isolines),
    });

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
                    'coordinates': [[[x0, y0],[x1, y0],[x1, y1],[x0, y1]]],
                },
            },
        ]
    };
    var vectorSource2 = new VectorSource({
        features: new GeoJSON().readFeatures(box),
    });
    vectorSource2.addFeature(new Feature(new Circle(fromLonLat([-7, 33]), 0.5e6)));

    var vectorLayer1 = new VectorLayer({
        source: vectorSource1,
        style: styleFunction,
    });
    var vectorLayer2 = new VectorLayer({
        source: vectorSource2,
        style: styleFunction,
    });
    var map = new Map({
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            vectorLayer1,
            vectorLayer2,
        ],
        target: 'map',
        view: new View({
            center: fromLonLat(centre),
            zoom: 3,
        }),
    });
});
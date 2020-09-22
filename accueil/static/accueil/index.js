"use strict";
//side-menu interaction
var ham = document.querySelector("#ham");
var shadow = document.querySelector("#shadow");
var menu = document.querySelector("#side_menu");
var close_btn = document.querySelector("#close_btn");
ham.addEventListener("click", function() {
    shadow.className = "show-shadow";
    menu.className = "show-menu";
});
close_btn.addEventListener("click", function() {
    shadow.className = "hide-shadow";
    menu.className = "hide-menu";
});
// requete ajax pour collecter les donnees sous format json depuis le serveur
var request = new XMLHttpRequest();
request.open("GET", "temp", false);
request.send(null)
var my_JSON_object = JSON.parse(request.responseText);
var height = my_JSON_object['json'][0]['header']['Nj'];
var width = my_JSON_object['json'][0]['header']['Ni'];
var [lo1, la1] = ol.proj.fromLonLat([my_JSON_object['json'][0]['header']['lo1'], my_JSON_object['json'][0]['header']['la1']])
var [lo2, la2] = ol.proj.fromLonLat([my_JSON_object['json'][0]['header']['lo2'], my_JSON_object['json'][0]['header']['la2']])
var dx = (lo2 - lo1) / my_JSON_object['json'][0]['header']['Ni'],
    dy = (la2 - la1) / my_JSON_object['json'][0]['header']['Nj'];
// convertir la donnee de matrice 1D en matrice 2D
var zData = new Array(height);
for (var j = 0; j < height; j++) {
    zData[j] = new Array(width);
    for (var i = 0; i < width; i++) {
        zData[j][i] = my_JSON_object['json'][0]['data'][i + j * width];
    }
}
// regler le parametre geotransform (le cadre dans lequel le tracee va s'afficher)
var geoTransform = [lo1, dx, 0, la1, 0, dy]
    // regler le parametre intervalsZ (la division des points de l'espace en des isolignes/isobandes)
var intervalsZ = [-20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 25, 30, 35, 40]
    // regler les couleurs pour les isobandes : retourne un tableau ds lequel le 1er couleur est de l'intervalle le plus bas
var styles2 = (function() {
        let r = []
        for (let i = 0; i < 14; i++) {
            r.push(new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'hsla(' + (276 + i * 360 / 14) % 360 + ', 100%, 50%, 1)',
                }),
            }))
        }
        return r
    })()
    //fonction qui va delivrer pour chaque "feature (intervalle)" le couleur correspondant
var styleFunction2 = function(feature) {
        return styles2[(feature.values_['0'].lowerValue + 20) / 5];
    }
    // utilisation de biblio rastertools pour tracer les isolignes/isobandes
var linesZ = rastertools.isobands(zData, geoTransform, intervalsZ)
    // objet geojson pour tracer le cadre qui contourne le tracee
var box = {
    'type': 'FeatureCollection',
    'crs': {
        'type': 'name',
        'properties': {
            'name': 'EPSG:3857',
        },
    },
    'features': [{
        'type': 'Feature',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [lo1, la1],
                    [lo2, la1],
                    [lo2, la2],
                    [lo1, la2]
                ]
            ],
        },
    }, ]
};
//le layer correspondant aux isolignes
var isolines_layer = new ol.layer.Group({
    layers: [
        new ol.layer.Vector({
            source: new ol.source.Vector({
                features: new ol.format.GeoJSON().readFeatures(linesZ),
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'green',
                    width: 1,
                })
            })
        })
    ]
});
//le layer correspondant aux isobandes
var isobands_layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(linesZ),
        }),
        style: styleFunction2
    })
    //fonds cartes
var fond = [];
fond.push(
    new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: geojson
        }),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgb(0, 130, 224)'
            })
        }),
        visible: false
    })
)

fond.push(new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true
}))

fond.push(new ol.layer.Tile({
    title: 'Global Imagery',
    source: new ol.source.TileWMS({
        url: 'https://ahocevar.com/geoserver/wms',
        params: { LAYERS: 'nasa:bluemarble', TILED: true }
    }),
    visible: true
}));

//openview map
var map = new ol.Map({
    target: 'map',
    layers: [
        fond[0], fond[1], fond[2],
        isolines_layer, isobands_layer,
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
//fonction responsable a activer les isobandes et cacher les autres
function isobands() {
    console.log("isobands")
    isobands_layer.setVisible(true)
    isolines_layer.setVisible(false)
}
//fonction responsable a activer les isolignes et cacher les autres
function isolines() {
    console.log("isolines")
    isolines_layer.setVisible(true)
    isobands_layer.setVisible(false)
}

var fonds = document.querySelectorAll(".fond");

function changer_fond(selection) {
    fond.forEach(function(element) {
        element.setVisible(false);
    });
    fond[selection.getAttribute("numero")].setVisible(true);
}
fonds.forEach(function(element) {
    element.addEventListener("click", function() {
        changer_fond(element)
    })
});
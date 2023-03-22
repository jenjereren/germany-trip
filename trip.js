// basemaps of choice, no access tokens needed :)
var osmDE = L.tileLayer("https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

var stadiadark = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  }
);

var stamentoner = L.tileLayer(
  "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}",
  {
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abcd",
    maxZoom: 18,
    ext: "png",
  }
);

// basemap labels
var baseMaps = {
  "Stadia Alidade Smooth Dark": stadiadark,
  "Stamen Toner Lite": stamentoner,
  "OpenStreetMap DE": osmDE,
};

// declare map with center and initial zoom level
var map = L.map("map", {
  center: [49.986, 7.9],
  zoom: 13,
});

// data layers
var overlays = {};

// place basemaps and overlays in control checklist
var layerControl = L.control.layers(baseMaps, overlays).addTo(map);

stadiadark.addTo(map); // set as default basemap

// display geojson

let ringtrack = L.layerGroup().addTo(map);

let photopts = L.layerGroup().addTo(map);

function addMyData(feature, layer) {
  if (feature.properties && feature.properties.popupContent) {
    ringtrack.addLayer(layer);
    layer.bindPopup(feature.properties.popupContent);
  }
}

var lineStyle = {
  color: "#ff1900",
  weight: 4,
  dashArray: "7, 14",
};

$.getJSON("/data/ringtour.geojson", function (data) {
  // add GeoJSON layer to the map once the file is loaded
  L.geoJson(data, {
    style: lineStyle,
    onEachFeature: addMyData,
  }); //.addTo(map);
});

layerControl.addOverlay(ringtrack, "Ringticket track");

// change the default blue pin to a custom marker
var customMarker = L.icon({
  iconUrl: "photomarker.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",

  iconSize: [43, 42], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [17, 38], // point of the icon which will correspond to marker's location
  shadowAnchor: [11, 59], // the same for the shadow
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
});

var trainMarker = L.icon({
  iconUrl: "trainmarker.png",
  //shadowUrl:
  // "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",

  iconSize: [37, 40], // size of the icon
  //shadowSize: [50, 64], // size of the shadow
  iconAnchor: [17, 38], // point of the icon which will correspond to marker's location
  //shadowAnchor: [11, 59], // the same for the shadow
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
});
// display pins with popup photos

$.getJSON("/data/photo_pts.geojson", function (data) {
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        title: feature.properties.name,
        opacity: 0.9,
        icon: customMarker,
      })
        .bindPopup(
          "<img src='/data/" +
            feature.properties.picture +
            "' height='450' /> <p>" +
            feature.properties.desc +
            "</p>"
        )
        .openPopup();
    },
  }).addTo(photopts);
});

// display train stations of interest

let trains = L.layerGroup().addTo(map);

$.getJSON("/data/train_stations.geojson", function (data) {
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        title: feature.properties.name,
        opacity: 0.9,
        icon: trainMarker,
      })
        .bindPopup(feature.properties.desc)
        .openPopup();
    },
  }).addTo(trains);
});

layerControl.addOverlay(photopts, "Photo points");
layerControl.addOverlay(trains, "Train stations");

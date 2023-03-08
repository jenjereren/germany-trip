const map = L.map("map").setView([49.986, 7.9], 13);

const CyclOSM = L.tileLayer(
  "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
  {
    maxZoom: 20,
    attribution:
      '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

CyclOSM.addTo(map);

function onEachFeature(feature, layer) {
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.popupContent) {
    layer.bindPopup(feature.properties.popupContent);
  }
}

var lineStyle = {
  color: "#ff0000",
  weight: 5,
  opacity: 0.65,
  dashArray: "10, 20",
};

$.getJSON("/data/ringtour.geojson", function (data) {
  // add GeoJSON layer to the map once the file is loaded
  L.geoJson(data, {
    style: lineStyle,
    onEachFeature: onEachFeature,
  }).addTo(map);
});

$.getJSON("/data/photo_pts.geojson", function (data) {
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng);
    },
  }).addTo(map);
});

const map = L.map("map").setView([49.986, 7.9], 13);

const CyclOSM = L.tileLayer(
  "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
  {
    maxZoom: 20,
    attribution:
      '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

//CyclOSM.addTo(map);

var osmDE = L.tileLayer("https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

osmDE.addTo(map);

function onEachFeature(feature, layer) {
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.popupContent) {
    layer.bindPopup(feature.properties.popupContent);
  }
}

var lineStyle = {
  color: "#ff1900",
  weight: 4,
  title: "Ringticket track",
  dashArray: "7, 14",
};

$.getJSON("/data/ringtour.geojson", function (data) {
  // add GeoJSON layer to the map once the file is loaded
  L.geoJson(data, {
    style: lineStyle,
    onEachFeature: onEachFeature,
  }).addTo(map);
});

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

//L.marker([50.00945, 7.85197], { icon: customMarker }).addTo(map);

$.getJSON("/data/photo_pts.geojson", function (data) {
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        title: feature.properties.name,
        opacity: 0.9,
        icon: customMarker,
      }).bindPopup(
        "<img src='/data/" +
          feature.properties.picture +
          "' height='550' /> <p>" +
          feature.properties.desc +
          "</p>"
      );
    },
  }).addTo(map);
});

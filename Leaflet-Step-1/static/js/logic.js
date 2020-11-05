// Creating map object
var myMap = L.map("map", {
    center: [40.4555, -109.5287],
    zoom: 5.5
  });
  
// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

// Creating a function to return the radius of the circle marker based on the magnitude
  function markerSize(mag) {
    return mag*10000;
}

// Creating a function to return the fill color of the circle marker based on the magnitude
function markerColor(mag) {
    if (mag <= 1) {
        return "lightgreen";
    }
    else if ((mag>1) && (mag<=2)) {
        return "green";
    }
    else if ((mag>2) && (mag<=3)) {
        return "yellow";
    }
    else if ((mag>3) && (mag<=4)) {
        return "orange";
    }
    else if ((mag>4) && (mag<=5)) {
        return "red";
    }
    else if (mag>5) {
        return "darkred";
    }
}

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link, function (data) {
    console.log(data);
    console.log(data.features.length);
    for (var i=0; i<data.features.length; i++){
        L.circle([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]], {
            fillOpacity: 0.65,
            fillColor: markerColor(data.features[i].properties.mag),
            color: "none",
            radius: markerSize(data.features[i].properties.mag)
        }).bindPopup(`<h4>Location: ${data.features[i].properties.place}</h4><br>
        <h4>Magnitude: ${data.features[i].properties.mag}</h4><br>
        <h4>Time: ${data.features[i].properties.time}</h4>`)
        .addTo(myMap);
    }
    
    // Creating legend at the bottom right and adding to the map
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend"),
        magnitude = [0, 1, 2, 3, 4, 5],
        labels = [];

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i class="square" style="background:' + markerColor(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }       
        return div;
    };
    legend.addTo(myMap);
})
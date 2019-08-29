import * as ol from "openlayers";
import { PlaceProperties } from "./models";

const layers: ol.layer.Layer[] = [
  new ol.layer.Tile({
    source: new ol.source.OSM()
  })
];
const placeId = window.location.hash.substr(1);
let x = 135;
let y = 35;
if (placeId) {
  let url = "http://127.0.0.1:9000/test/" + placeId + ".json";
  console.log(url);
  fetch(url)
    .then(async res => {
      const features: ol.Feature[] = [];
      const geojson = new ol.format.GeoJSON();
      console.log(await res.text());
      let json = await res.json();
      const place = geojson.readFeature(json);
      const extent = place.getGeometry().getExtent();
      x = (extent[0] + extent[2]) / 2;
      y = (extent[1] + extent[3]) / 2;
      const placeProp: PlaceProperties = place.getProperties() as any;
      placeProp.photos.forEach(async photoId => {
        res = await fetch(
          "http://127.0.0.1:9000/test/" + placeId + "/" + photoId + ".json"
        );
        json = res.json();
        const photo = geojson.readFeature(json);
        features.push(photo);
      });
      layers.push(
        new ol.layer.Vector({
          source: new ol.source.Vector({
            features: features
          })
        })
      );
      const map = new ol.Map({
        target: "map",
        layers: layers,
        view: new ol.View({
          center: ol.proj.fromLonLat([x, y]),
          zoom: 16
        })
      });
    })
    .catch(err => console.log(err));
}

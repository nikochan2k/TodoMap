import * as ol from "openlayers";
import storage from "./storage";
import { MyMap } from "./Map";
import { PhotoProperties } from "./models";

const placeId = window.location.hash.substr(1);
if (placeId) {
  let key = placeId + ".json";
  storage
    .get(key)
    .then(async entryJson => {
      const placeIcon =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
      const cameraIcon =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>';
      const cameraEIcon =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>';

      const features: ol.Feature[] = [];
      const geojson = new ol.format.GeoJSON({
        defaultDataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857"
      });
      const place = geojson.readFeature(entryJson);
      const placeStyle = new ol.style.Style({
        image: new ol.style.Icon({
          src: placeIcon
        })
      });
      place.setStyle(placeStyle);
      features.push(place);
      const extent = place.getGeometry().getExtent();
      const x = (extent[0] + extent[2]) / 2;
      const y = (extent[1] + extent[3]) / 2;
      const cameraStyle = new ol.style.Style({
        image: new ol.style.Icon({
          src: cameraIcon
        })
      });
      let items = await storage.list(false, placeId + "/");
      for (const item of items) {
        if (item.key.endsWith(".json")) {
          const itemJson = await storage.get(item.key);
          const itemFeature = geojson.readFeature(itemJson);
          const photoProp = itemFeature.getProperties() as PhotoProperties;
          let style: ol.style.Style;
          if (photoProp.direction == null) {
            style = cameraStyle;
          } else {
            style = new ol.style.Style({
              image: new ol.style.Icon({
                src: cameraEIcon,
                rotation: (photoProp.direction - 90) * (Math.PI / 180)
              })
            });
          }
          itemFeature.setStyle(style);
          features.push(itemFeature);
        }
      }
      const layers: ol.layer.Layer[] = [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        new ol.layer.Vector({
          source: new ol.source.Vector({
            features: features
          }),
          style: placeStyle
        })
      ];
      new MyMap({
        target: "map",
        layers: layers,
        view: new ol.View({
          center: [x, y],
          zoom: 16
        })
      });
    })
    .catch(err => console.log(err));
} else {
  const map = document.getElementById("map");
  map.innerHTML = "<h1>No Map</h1>";
}

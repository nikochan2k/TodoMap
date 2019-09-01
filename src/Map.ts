import * as ol from "openlayers";
import storage from "./storage";
import { PhotoProperties } from "./models";

interface F {
  distance: number;
  feature: ol.Feature | ol.render.Feature;
}

export class MyMap extends ol.Map {
  private popup: HTMLElement;
  private popupOverlay: ol.Overlay;

  constructor(options: ol.olx.MapOptions) {
    super(options);

    this.setup();
    this.on("singleclick", async (evt: ol.MapBrowserEvent) => {
      await this.setupSingleClickEvent(evt);
    });
  }

  private setup() {
    this.popup = document.getElementById("popup");
    this.popup.hidden = true;
    this.popupOverlay = new ol.Overlay({
      element: this.popup
    });
    this.addOverlay(this.popupOverlay);
  }

  private setupSingleClickEvent = async (event: ol.MapBrowserEvent) => {
    const [clickedX, clickedY] = event.coordinate;
    const items: F[] = [];
    this.forEachFeatureAtPixel(
      event.pixel,
      feature => {
        const point = feature.getGeometry() as ol.geom.Point;
        const [x, y] = point.getCoordinates();
        const distance = Math.pow(clickedX - x, 2) + Math.pow(clickedY - y, 2);
        items.push({ distance: distance, feature: feature });
      },
      {
        hitTolerance: 6
      }
    );
    if (0 < items.length) {
      items.sort((a, b) => {
        return a.distance - b.distance;
      });
      const feature = items[0].feature;
      const props = feature.getProperties();
      let innerHTML: string;
      if (props.placeId) {
        const photoProps = props as PhotoProperties;
        const caption = props.title ? props.title : props.datetime;
        const key = photoProps.placeId + "/" + photoProps.id + ".jpg";
        const image = await storage.get(key);
        innerHTML = `${caption}<br><img src="${image}" width="160" height="120">`;
      } else {
        innerHTML = props.title;
      }
      this.popup.innerHTML = innerHTML;
      this.popup.hidden = false;
      this.popupOverlay.setPosition(event.coordinate);
    } else {
      this.popup.innerHTML = "";
      this.popup.hidden = true;
    }
  };
}

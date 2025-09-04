import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

export default function DrawPolygon({ onPolygonComplete }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: { featureGroup: drawnItems },
      draw: {
        polygon: true,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;

      drawnItems.addLayer(layer); // Add the layer first

      // Convert to Turf coordinates for area calculation
      const latLngs = layer.toGeoJSON().geometry.coordinates[0]; // already closed
      const area = turf.area(layer.toGeoJSON());

      onPolygonComplete({ latLngs, area });
    });

    return () => {
      map.off(L.Draw.Event.CREATED);
      map.off(L.Draw.Event.DRAWSTART);
      map.removeControl(drawControl);
      //map.removeLayer(drawnItems);
    };
  }, [map, onPolygonComplete]);

  return null;
}
import { MapContainer, TileLayer } from "react-leaflet";
import DrawPolygon from "./DrawPolygon";

export default function MapMyYard({ latitude, longitude, onPolygonComplete }) {
  const center = latitude && longitude ? [latitude, longitude] : [37.8, -96]; // default US

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye"
      />

      <DrawPolygon onPolygonComplete={onPolygonComplete} />
    </MapContainer>
  );
}

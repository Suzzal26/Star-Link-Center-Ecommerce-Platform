import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./AddressMapPicker.css";

const DEFAULT_POSITION = [27.7172, 85.324];

const AREA_LIST = [
  "Bagbazar", "Thamel", "Putalisadak", "Chabahil", "Kalanki",
  "Gongabu", "Kalimati", "Balaju", "Dillibazar", "Baneshwor",
  "Lagankhel", "Jawalakhel", "Pulchowk", "Imadol", "Gwarko",
  "Sankhamul", "Balkumari", "Maitidevi", "Bhaktapur Durbar Square"
];

const SearchMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
};

const SmartAddressPicker = ({ value, onChange }) => {
  const [query, setQuery] = useState(value?.address || "");
  const [results, setResults] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(
    value?.lat && value?.lng ? [value.lat, value.lng] : DEFAULT_POSITION
  );
  const inputRef = useRef();

  const handleSelect = async (place) => {
    setQuery(place);
    setResults([]);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${place}, Nepal&limit=1`
    );
    const data = await res.json();

    if (data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const coords = [parseFloat(lat), parseFloat(lon)];

      setSelectedPosition(coords);
      onChange({
        address: display_name,
        lat: coords[0],
        lng: coords[1]
      });
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (val.length >= 2) {
      const filtered = AREA_LIST.filter((area) =>
        area.toLowerCase().includes(val.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="address-map-picker">
      <label className="form-label">Address (Kathmandu Valley only)</label>
      <input
        type="text"
        className="form-control"
        placeholder="Start typing: Bagbazar, Thamel, Pulchowk..."
        value={query}
        ref={inputRef}
        onChange={handleChange}
        autoComplete="off"
        required
      />
      {results.length > 0 && (
        <ul className="autocomplete-results">
          {results.map((place) => (
            <li key={place} onClick={() => handleSelect(place)}>
              {place}
            </li>
          ))}
        </ul>
      )}

      <MapContainer
        center={selectedPosition}
        zoom={14}
        className="leaflet-map-container"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SearchMap center={selectedPosition} />
        <Marker position={selectedPosition}>
          <Popup>{value?.address || "Select area"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default SmartAddressPicker;

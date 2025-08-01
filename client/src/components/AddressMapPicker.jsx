import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./AddressMapPicker.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DEFAULT_POSITION = [27.7172, 85.324]; // Kathmandu

const AddressMapPicker = ({ value, onChange }) => {
  const [position, setPosition] = useState(
    value?.lat && value?.lng ? [value.lat, value.lng] : DEFAULT_POSITION
  );
  const [address, setAddress] = useState(value?.address || "");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef();

  const ClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        setSearch(""); // clear search when clicking manually
        setSuggestions([]);
      },
    });
    return null;
  };

  // Fetch suggestions on typing
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          search
        )}&limit=5&countrycodes=np`
      )
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data);
        })
        .catch(() => {
          setSuggestions([]);
        });
    }, 500); // debounce

    return () => clearTimeout(delay);
  }, [search]);

  const handleSuggestionClick = async (sug) => {
    const lat = parseFloat(sug.lat);
    const lon = parseFloat(sug.lon);
    setPosition([lat, lon]);
    setSearch(sug.display_name);
    setSuggestions([]);

    // Reverse geocode to confirm district
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    const data = await res.json();
    const addr = data.display_name;

    const isValid =
      addr.includes("Kathmandu") ||
      addr.includes("Lalitpur") ||
      addr.includes("Bhaktapur");

    if (isValid) {
      setAddress(addr);
      onChange({ address: addr, lat, lng: lon });
    } else {
      setAddress("❌ Outside Kathmandu Valley");
      onChange(null);
    }
  };

  // Reverse geocode on map click or position change
  useEffect(() => {
    const [lat, lon] = position;

    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();
        const addr = data.display_name;

        const isValid =
          addr.includes("Kathmandu") ||
          addr.includes("Lalitpur") ||
          addr.includes("Bhaktapur");

        if (isValid) {
          setAddress(addr);
          onChange({ address: addr, lat, lng: lon });
        } else {
          setAddress("❌ Outside Kathmandu Valley");
          onChange(null);
        }
      } catch (err) {
        setAddress("⚠️ Could not resolve location");
        onChange(null);
      }
    };

    fetchAddress();
  }, [position, onChange]);

  return (
    <div className="address-map-picker">
      <label className="form-label">Address (Kathmandu Valley only)</label>
      <input
        type="text"
        className="form-control mb-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Start typing location..."
        autoComplete="off"
      />

      {suggestions.length > 0 && (
        <ul className="autocomplete-results">
          {suggestions.map((sug, idx) => (
            <li key={idx} onClick={() => handleSuggestionClick(sug)}>
              {sug.display_name}
            </li>
          ))}
        </ul>
      )}

      <input
        type="text"
        className="form-control mb-2 text-muted"
        value={address}
        readOnly
      />

      <MapContainer
        center={position}
        zoom={14}
        preferCanvas={true}
        className="leaflet-map-container"
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler />
        <Marker position={position}>
          <Popup>{address || "Click map or search address"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default AddressMapPicker;

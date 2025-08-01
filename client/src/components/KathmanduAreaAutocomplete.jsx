import { useState } from "react";

const SUGGESTED_PLACES = [
  "Bagbazar", "Thamel", "Putalisadak", "Baneshwor", "Sankhamul",
  "Lagankhel", "Jawalakhel", "Pulchowk", "Balkumari", "Bhaktapur Durbar Square",
  "Gongabu", "Chabahil", "Kalanki", "Imadol", "Balaju"
];

const KathmanduAreaAutocomplete = ({ onSelect, showMap, setShowMap }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    const filtered = SUGGESTED_PLACES.filter((place) =>
      place.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
  };

  const handleSelect = (place) => {
    setQuery(place);
    setResults([]);
    onSelect(place);
  };

  return (
    <div className="address-autocomplete">
      <label className="form-label">Address (Kathmandu Valley only)</label>
      <input
        type="text"
        className="form-control"
        value={query}
        onChange={handleChange}
        placeholder="e.g. Bagbazar, Thamel, Imadol..."
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
      <button
        type="button"
        className="btn btn-outline-primary btn-sm mt-2"
        onClick={() => setShowMap(!showMap)}
      >
        {showMap ? "Hide Map" : "Select on Map"}
      </button>
    </div>
  );
};

export default KathmanduAreaAutocomplete;

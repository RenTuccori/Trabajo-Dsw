import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function AddressAutocomplete({ onSelect, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const q = encodeURIComponent(query);
        // IMPORTANT: replace the email query param with a real contact address for production
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${q}&email=dev@yourdomain.com`;
        const res = await fetch(url);
        const data = await res.json();
        setResults(data || []);
        setOpen(true);
      } catch (err) {
        console.error('Nominatim error', err);
      }
    }, 300);
    return () => clearTimeout(timer.current);
  }, [query]);

  function handleSelect(item) {
    setQuery(item.display_name);
    setOpen(false);
    onSelect?.({
      address: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      raw: item,
    });
  }

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setOpen(true)}
        placeholder="Buscar dirección..."
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border rounded mt-1 max-h-48 overflow-auto">
          {results.map((r) => (
            <li
              key={r.place_id}
              onClick={() => handleSelect(r)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

AddressAutocomplete.propTypes = {
  onSelect: PropTypes.func,
  initialValue: PropTypes.string,
};

AddressAutocomplete.defaultProps = {
  onSelect: undefined,
  initialValue: '',
};

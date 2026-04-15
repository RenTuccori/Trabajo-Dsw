import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function AddressAutocomplete({ onSelect, onChange, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

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
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=10&q=${q}&email=dev@yourdomain.com`;
        const res = await fetch(url);
        const data = await res.json();
        
        // Filtrar para que solo muestre lugares que tengan calle especificada
        const validResults = (data || []).filter(
          (item) => item.address && (item.address.road || item.address.pedestrian)
        );
        
        setResults(validResults.slice(0, 6));
        setOpen(true);
      } catch (err) {
        console.error('Nominatim error', err);
      }
    }, 300);
    return () => clearTimeout(timer.current);
  }, [query]);

  function formatAddress(item) {
    if (!item.address) return item.display_name;
    const { road, pedestrian, house_number, city, town, village, state, country } = item.address;
    
    const street = road || pedestrian || '';
    const number = house_number ? ` ${house_number}` : '';
    const streetWithNumber = street ? `${street}${number}` : '';
    const cityOrTown = city || town || village || '';
    const province = state || '';
    
    const parts = [streetWithNumber, cityOrTown, province, country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : item.display_name;
  }

  function handleSelect(item) {
    const formattedName = formatAddress(item);
    setQuery(formattedName);
    setOpen(false);
    onSelect?.({
      address: formattedName,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      raw: item,
    });
  }

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange?.(e.target.value);
        }}
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
              {formatAddress(r)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

AddressAutocomplete.propTypes = {
  onSelect: PropTypes.func,
  onChange: PropTypes.func,
  initialValue: PropTypes.string,
};

AddressAutocomplete.defaultProps = {
  onSelect: undefined,
  onChange: undefined,
  initialValue: '',
};

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cars as carsApi } from '../api';
import './SearchCars.css';

export default function SearchCars() {
  const [model, setModel] = useState('');
  const [colour, setColour] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ models: [], colours: [] });

  useEffect(() => {
    carsApi.models().then((r) => setFilters({ models: r.models || [], colours: r.colours || [] })).catch(() => {});
    setLoading(true);
    carsApi.list({ available: true }).then((data) => setList(Array.isArray(data) ? data : [])).catch(() => setList([])).finally(() => setLoading(false));
  }, []);

  const search = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const params = { available: true };
      if (model) params.model = model;
      if (colour) params.colour = colour;
      const data = await carsApi.list(params);
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-cars app-container">
      <h1>Browse Cars</h1>
      <form onSubmit={search} className="search-form card">
        <div className="search-row">
          <div className="input-group">
            <label>Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Honda City"
              list="models"
            />
            <datalist id="models">
              {filters.models.map((m) => <option key={m} value={m} />)}
            </datalist>
          </div>
          <div className="input-group">
            <label>Colour</label>
            <input
              type="text"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              placeholder="e.g. White"
              list="colours"
            />
            <datalist id="colours">
              {filters.colours.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      <div className="results">
        {loading && <p>Loading...</p>}
        {!loading && list.length === 0 && <p>No cars found.</p>}
        {!loading && list.length > 0 && (
          <div className="car-grid">
            {list.map((c) => (
              <div key={c.id} className="car-card card">
                <div className="car-icon">🚗</div>
                <h3>{c.model}</h3>
                <p className="car-colour">{c.colour}</p>
                <p className="car-price">₹ {Number(c.price_per_day).toLocaleString('en-IN')} <span>/ day</span></p>
                <p className="car-avail">{c.available ? 'Available' : 'Not available'}</p>
                <Link to={`/book/${c.id}`} className="btn btn-primary">Book</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

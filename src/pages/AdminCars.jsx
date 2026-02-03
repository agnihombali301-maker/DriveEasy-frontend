import { useState, useEffect } from 'react';
import { cars as carsApi, admin } from '../api';
import './Admin.css';

export default function AdminCars() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ model: '', colour: '', price_per_day: 2500, available: true });

  const load = () => {
    carsApi.list().then((data) => setList(Array.isArray(data) ? data : [])).catch(() => setList([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await admin.createCar(form);
      setShowForm(false);
      setForm({ model: '', colour: '', price_per_day: 2500, available: true });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this car?')) return;
    try {
      await admin.deleteCar(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="app-container"><p>Loading...</p></div>;

  return (
    <div className="admin-page app-container">
      <h1>Manage Cars</h1>
      <button type="button" className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Car'}
      </button>
      {showForm && (
        <form onSubmit={handleCreate} className="card admin-form">
          <h2>New car</h2>
          <div className="form-row">
            <div className="input-group">
              <label>Model</label>
              <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>Colour</label>
              <input value={form.colour} onChange={(e) => setForm({ ...form, colour: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>Price per day (INR)</label>
              <input type="number" value={form.price_per_day} onChange={(e) => setForm({ ...form, price_per_day: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Available</label>
              <select value={form.available} onChange={(e) => setForm({ ...form, available: e.target.value === 'true' })}>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Create car</button>
        </form>
      )}
      <div className="admin-table card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Model</th>
              <th>Colour</th>
              <th>Price/day (INR)</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.model}</td>
                <td>{c.colour}</td>
                <td>₹{Number(c.price_per_day).toLocaleString('en-IN')}</td>
                <td>{c.available ? 'Yes' : 'No'}</td>
                <td>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

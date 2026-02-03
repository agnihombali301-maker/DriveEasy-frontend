import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookings as bookingsApi } from '../api';
import './MyBookings.css';

export default function MyBookings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsApi.list().then((data) => setList(Array.isArray(data) ? data : [])).catch(() => setList([])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="app-container"><p>Loading bookings...</p></div>;

  return (
    <div className="my-bookings app-container">
      <h1>My Bookings</h1>
      {list.length === 0 && <p className="empty">No bookings yet. <Link to="/search">Browse cars</Link> to book.</p>}
      <div className="booking-list">
        {list.map((b) => {
          const car = b.car || {};
          return (
            <div key={b.id} className="booking-card card">
              <div className="booking-card-header">
                <span className="booking-id">#{b.id}</span>
                <span className={`status ${b.status}`}>{b.status}</span>
              </div>
              <div className="booking-card-body">
                <p><strong>{car.model}</strong> — {car.colour}</p>
                <p>{b.from_date} to {b.to_date}</p>
                <p className="amount">₹ {Number(b.total_amount).toLocaleString('en-IN')}</p>
              </div>
              <Link to={`/booking-confirmation/${b.id}`} className="btn btn-outline btn-sm">View details</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

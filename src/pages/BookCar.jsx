import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cars as carsApi, bookings as bookingsApi } from '../api';
import { useAuth } from '../App';
import './BookCar.css';

export default function BookCar() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [car, setCar] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    carsApi.get(Number(carId)).then(setCar).catch(() => setCar(null)).finally(() => setLoading(false));
  }, [carId]);

  const from = fromDate ? new Date(fromDate) : null;
  const to = toDate ? new Date(toDate) : null;
  const days = from && to && to > from ? Math.ceil((to - from) / (1000 * 60 * 60 * 24)) : 0;
  const total = car ? car.price_per_day * Math.max(1, days) : 0;
  const balance = user?.balance ?? 0;
  const canPay = balance >= total;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        car_id: Number(carId),
        from_date: fromDate,
        to_date: toDate,
      };
      const { booking, new_balance } = await bookingsApi.create(payload);
      navigate(`/booking-confirmation/${booking.id}`);
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="app-container"><p>Loading car...</p></div>;
  if (!car) return <div className="app-container"><p>Car not found.</p></div>;

  return (
    <div className="book-car app-container">
      <h1>Book: {car.model} — {car.colour}</h1>
      <div className="balance-bar card">
        Your balance: <strong>₹ {balance.toLocaleString('en-IN')}</strong>
        {total > 0 && (
          <span className={canPay ? 'ok' : 'insufficient'}>
            Total: ₹ {total.toLocaleString('en-IN')} {canPay ? '✓' : '(insufficient)'}
          </span>
        )}
      </div>
      <form onSubmit={handleSubmit} className="book-form card">
        <h2>Rental period (pre-paid)</h2>
        <p className="hint">Price: ₹ {Number(car.price_per_day).toLocaleString('en-IN')} per day × {Math.max(1, days)} day(s) = ₹ {total.toLocaleString('en-IN')}</p>
        <div className="form-row">
          <div className="input-group">
            <label>From date</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>To date</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required min={fromDate} />
          </div>
        </div>
        {error && (
          <div className="auth-error">
            {error}
            {(error.includes('session') || error.includes('expired') || error.includes('sign in')) && (
              <div style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    sessionStorage.setItem('redirectAfterLogin', `/book/${carId}`);
                    logout();
                    navigate('/login');
                  }}
                >
                  Sign in again
                </button>
              </div>
            )}
          </div>
        )}
        <button type="submit" className="btn btn-primary btn-lg" disabled={submitting || !fromDate || !toDate || days < 1 || !canPay}>
          {submitting ? 'Processing...' : `Pay ₹ ${total.toLocaleString('en-IN')} & Confirm Booking`}
        </button>
      </form>
    </div>
  );
}

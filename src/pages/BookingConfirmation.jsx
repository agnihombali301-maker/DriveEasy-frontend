import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { bookings as bookingsApi } from '../api';
import { useAuth } from '../App';
import './BookingConfirmation.css';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const { refreshUser } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsApi.get(Number(bookingId)).then((b) => { setBooking(b); refreshUser(); }).catch(() => setBooking(null)).finally(() => setLoading(false));
  }, [bookingId, refreshUser]);

  if (loading) return <div className="app-container"><p>Loading...</p></div>;
  if (!booking) return <div className="app-container"><p>Booking not found.</p></div>;

  const car = booking.car || {};

  return (
    <div className="booking-confirmation app-container">
      <div className="confirmation-card card">
        <div className="confirmation-header">
          <span className="confirmation-icon">✓</span>
          <h1>Booking Confirmed</h1>
          <p>Thank you for choosing DriveEasy</p>
        </div>
        <div className="confirmation-details">
          <div className="detail-row">
            <span>Booking ID</span>
            <strong>#{booking.id}</strong>
          </div>
          <div className="detail-row">
            <span>Car</span>
            <strong>{car.model} — {car.colour}</strong>
          </div>
          <div className="detail-row">
            <span>From</span>
            <strong>{booking.from_date}</strong>
          </div>
          <div className="detail-row">
            <span>To</span>
            <strong>{booking.to_date}</strong>
          </div>
          <div className="detail-row total">
            <span>Amount paid</span>
            <strong>₹ {Number(booking.total_amount).toLocaleString('en-IN')}</strong>
          </div>
        </div>
        <div className="confirmation-actions">
          <Link to="/my-bookings" className="btn btn-primary">My Bookings</Link>
          <Link to="/search" className="btn btn-outline">Book another car</Link>
        </div>
      </div>
    </div>
  );
}

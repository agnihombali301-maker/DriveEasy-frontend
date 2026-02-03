import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="dashboard app-container">
      <div className="hero">
        <h1>Welcome to DriveEasy</h1>
        <p className="hero-sub">Rent cars by model and colour. Pre-paid in INR.</p>
      </div>
      {!isAdmin && (
        <div className="dashboard-cards">
          <div className="balance-card card">
            <h2>Your Balance</h2>
            <p className="balance-amount">₹ {(user?.balance ?? 0).toLocaleString('en-IN')}</p>
            <p className="balance-note">Use this balance to rent cars (demo currency)</p>
          </div>
          <Link to="/search" className="action-card card">
            <span className="action-icon">🚗</span>
            <h2>Browse & Book Cars</h2>
            <p>Choose model, colour and rental period (from date – to date).</p>
          </Link>
          <Link to="/my-bookings" className="action-card card">
            <span className="action-icon">📋</span>
            <h2>My Bookings</h2>
            <p>View and manage your car rentals.</p>
          </Link>
        </div>
      )}
      {isAdmin && (
        <div className="dashboard-cards">
          <Link to="/admin/users" className="action-card card">
            <span className="action-icon">👥</span>
            <h2>Manage Users</h2>
            <p>View and edit customers and balances.</p>
          </Link>
          <Link to="/admin/cars" className="action-card card">
            <span className="action-icon">🚗</span>
            <h2>Manage Cars</h2>
            <p>Add, edit or remove cars.</p>
          </Link>
          <Link to="/admin/bookings" className="action-card card">
            <span className="action-icon">📋</span>
            <h2>Manage Bookings</h2>
            <p>View and manage all rentals.</p>
          </Link>
        </div>
      )}
    </div>
  );
}

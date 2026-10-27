import { useEffect, useState } from "react";
import http from "../api/http.js";

const formatDate = (value) => new Date(value).toLocaleDateString("en-IN");

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    http
      .get("/bookings/mine")
      .then((res) => setBookings(res.data))
      .catch((err) => setError(err.response?.data?.msg || "Could not load bookings"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div>
      <h2>My bookings</h2>
      {error && <p className="message error">{error}</p>}
      {!error && bookings.length === 0 && <p>You have no bookings yet.</p>}

      {bookings.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Type</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Nights</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.room?.roomNumber ?? "-"}</td>
                <td>{b.room?.type ?? "-"}</td>
                <td>{formatDate(b.fromDate)}</td>
                <td>{formatDate(b.toDate)}</td>
                <td>{b.totalDays}</td>
                <td>₹{b.totalAmount}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

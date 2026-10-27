import { useEffect, useState } from "react";
import http from "../api/http.js";
import { getUser } from "../utils/auth.js";

const buildEmptyForm = (phone = "") => ({
  fromDate: "",
  toDate: "",
  phone,
  cardHolderName: "",
  cardLast4: "",
});

export default function Dashboard() {
  const user = getUser();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form, setForm] = useState(buildEmptyForm(user?.phone || ""));
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    http
      .get("/rooms")
      .then((res) => setRooms(res.data))
      .catch((err) =>
        setMessage({ type: "error", text: err.response?.data?.msg || "Could not load rooms" })
      )
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedRoom) return;
    setMessage({ type: "", text: "" });
    try {
      const res = await http.post("/bookings", { roomId: selectedRoom._id, ...form });
      setMessage({
        type: "success",
        text: `Room ${selectedRoom.roomNumber} booked for ${res.data.totalDays} day(s). Total: ₹${res.data.totalAmount}`,
      });
      setSelectedRoom(null);
      setForm(buildEmptyForm(user?.phone || ""));
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.msg || "Booking failed" });
    }
  };

  if (loading) return <p>Loading rooms...</p>;

  return (
    <div>
      <h2>Available rooms</h2>
      {message.text && <p className={`message ${message.type}`}>{message.text}</p>}

      {rooms.length === 0 && <p>No rooms have been added yet.</p>}

      <div className="room-grid">
        {rooms.map((room) => (
          <div className="card room-card" key={room._id}>
            {room.photos?.[0] && <img src={room.photos[0]} alt={`Room ${room.roomNumber}`} />}
            <h3>
              Room {room.roomNumber} · {room.type}
            </h3>
            <p>{room.description}</p>
            <p>
              Capacity: {room.capacity} · Rent: ₹{room.rent}/night
            </p>
            <button
              className="btn"
              onClick={() => {
                setSelectedRoom(room);
                setMessage({ type: "", text: "" });
              }}
            >
              Book this room
            </button>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className="card form-card">
          <h3>Book Room {selectedRoom.roomNumber}</h3>
          <form onSubmit={handleBook}>
            <label>
              Check-in
              <input type="date" name="fromDate" value={form.fromDate} onChange={handleChange} required />
            </label>
            <label>
              Check-out
              <input type="date" name="toDate" value={form.toDate} onChange={handleChange} required />
            </label>
            <label>
              Phone
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
            </label>
            <label>
              Cardholder name
              <input name="cardHolderName" value={form.cardHolderName} onChange={handleChange} required />
            </label>
            <label>
              Last 4 digits of card
              <input
                name="cardLast4"
                value={form.cardLast4}
                onChange={handleChange}
                pattern="\d{4}"
                maxLength={4}
                required
              />
            </label>
            <div className="row">
              <button className="btn" type="submit">
                Confirm booking
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => setSelectedRoom(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

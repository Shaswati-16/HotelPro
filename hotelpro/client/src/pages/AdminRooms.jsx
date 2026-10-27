import { useState } from "react";
import http from "../api/http.js";

const emptyForm = {
  roomNumber: "",
  capacity: "",
  rent: "",
  type: "",
  description: "",
  photos: "",
};

export default function AdminRooms() {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setSubmitting(true);

    // Photos are entered as comma-separated URLs
    const payload = {
      ...form,
      photos: form.photos
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean),
    };

    try {
      const res = await http.post("/rooms", payload);
      setMessage({ type: "success", text: `Room ${res.data.roomNumber} added.` });
      setForm(emptyForm);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.msg || "Could not add room" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card form-card">
      <h2>Add a room</h2>
      {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Room number
          <input type="number" name="roomNumber" value={form.roomNumber} onChange={handleChange} required />
        </label>
        <label>
          Capacity (guests)
          <input type="number" min="1" name="capacity" value={form.capacity} onChange={handleChange} required />
        </label>
        <label>
          Rent per night (₹)
          <input type="number" min="0" name="rent" value={form.rent} onChange={handleChange} required />
        </label>
        <label>
          Room type
          <input name="type" value={form.type} onChange={handleChange} placeholder="e.g. Deluxe" required />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </label>
        <label>
          Photo URLs (comma separated, optional)
          <input name="photos" value={form.photos} onChange={handleChange} />
        </label>
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Add room"}
        </button>
      </form>
    </div>
  );
}

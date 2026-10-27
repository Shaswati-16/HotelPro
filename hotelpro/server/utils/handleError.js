// Maps common Mongoose / MongoDB errors to clean HTTP responses.
const handleError = (res, error, fallbackMsg = "Internal server error") => {
  // Duplicate key (e.g. email or room number already exists)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || "value";
    return res.status(400).json({ msg: `That ${field} already exists` });
  }

  // Schema validation failed (e.g. missing required field)
  if (error.name === "ValidationError") {
    const first = Object.values(error.errors)[0];
    return res.status(400).json({ msg: first.message });
  }

  // Invalid ObjectId in the URL or body
  if (error.name === "CastError") {
    return res.status(400).json({ msg: "Invalid ID format" });
  }

  console.error(error);
  return res.status(500).json({ msg: fallbackMsg });
};

module.exports = handleError;

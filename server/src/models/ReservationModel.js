const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReservationModel = new Schema({
  restaurantName: { type: String, required: true },
  date: { type: Date, required: true },
  userId: { type: String, required: true },
  partySize: { type: Number, required: true },
});

module.exports = mongoose.model("Reservation", ReservationModel);

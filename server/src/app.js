const express = require("express");
const cors = require("cors");
const app = express();
const { celebrate, Joi, errors, Segments } = require("celebrate");
const RestaurantModel = require("./models/RestaurantModel");
const ReservationModel = require("./models/ReservationModel");
const formatRestaurant = require("./utils/formatRestaurants");
const formatReservation = require("./utils/formatReservation");
const validId = require("./utils/validId");

app.use(cors());
app.use(express.json());

app.get("/restaurants", async (request, response) => {
  const restaurants = await RestaurantModel.find({});
  const formattedRestaurants = restaurants.map((restaurant) =>
    formatRestaurant(restaurant)
  );
  response.status(200).send(formattedRestaurants);
});

app.get("/restaurants/:id", async (request, response) => {
  const { id } = request.params;
  if (!validId(id)) {
    return response.status(400).send({ message: "id provided is invalid" });
  }
  const restaurant = await RestaurantModel.findById(id);
  if (restaurant === null) {
    return response.status(404).send({ message: "id not found" });
  }
  return response.status(200).send(formatRestaurant(restaurant));
});

app.get("/reservations", async (request, response) => {
  const reservations = await ReservationModel.find({});
  const formattedReservations = reservations.map((reservation) =>
    formatReservation(reservation)
  );
  response.status(200).send(formattedReservations);
});

app.get("/reservations/:id", async (request, response) => {
  const { id } = request.params;
  if (!validId(id)) {
    return response.status(400).send({ message: "id provided is invalid" });
  }
  const reservation = await ReservationModel.findById(id);
  if (reservation === null) {
    return response.status(404).send({ message: "id not found" });
  }
  return response.status(200).send(formatReservation(reservation));
});

app.post("/restaurants/:id", async (request, response, next) => {
  const { body } = request;  
  const bookReservation = new ReservationModel(body);
  try {
    await bookReservation.save();
    const reservations = await ReservationModel.find({});
    const formattedReservations = reservations.map((reservation) =>
      formatReservation(reservation)
    );
    response.status(201).send(formattedReservations);
  } catch (error) {
    next(error);
  }
});

app.use(errors());

module.exports = app;

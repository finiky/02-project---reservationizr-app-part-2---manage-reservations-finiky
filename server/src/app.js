const express = require("express");
const cors = require("cors");
const app = express();
const { celebrate, Joi, errors, Segments } = require("celebrate");
const RestaurantModel = require("./models/RestaurantModel");
const ReservationModel = require("./models/ReservationModel");
const formatRestaurant = require("./utils/formatRestaurants");
const formatReservation = require("./utils/formatReservation");
const validId = require("./utils/validId");
const { auth } = require("express-oauth2-jwt-bearer");

app.use(cors());
app.use(express.json());
const checkJwt = auth({
  audience: "https://booking.com",
  issuer: "https://dev-knvdm70u.us.auth0.com/",
});
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

app.post(
  "/restaurants/:id", checkJwt,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      restaurantName: Joi.string().required(),
      partySize: Joi.number().min(1).required(),
      date: Joi.date().greater("now").required(),
    }),
  }),
  async (request, response, next) => {
    try {
      const { body, auth } = request;
      const reservationBody = {
        userId: auth.payload.sub,
        ...body,
      };
      const bookReservation = new ReservationModel(reservationBody);
      await bookReservation.save();
      const reservations = await ReservationModel.find({});
      const formattedReservations = reservations.map((reservation) =>
        formatReservation(reservation)
      );
      response.status(201).send(formattedReservations);
    } catch (error) {
      if (error.name === "ValidationError") {
        error.status = 400;
      }
      next(error);
    }
  }
);

app.use(errors());

module.exports = app;

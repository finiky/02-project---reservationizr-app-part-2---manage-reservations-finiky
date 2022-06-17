const express = require("express");
const cors = require("cors");
const app = express();
const { celebrate, Joi, errors, Segments } = require("celebrate");
const { auth } = require("express-oauth2-jwt-bearer");
const RestaurantModel = require("./models/RestaurantModel");
const ReservationModel = require("./models/ReservationModel");
const formatRestaurant = require("./utils/formatRestaurants");
const formatReservation = require("./utils/formatReservation");
const validId = require("./utils/validId");

const checkJwt = auth({
  audience: "https://booking.com",
  issuerBaseURL: "https://dev-knvdm70u.us.auth0.com/",
});

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
  if (validId(id) === false) {
    return response.status(400).send({ error: "invalid id is provided" });
  }
  const restaurant = await RestaurantModel.findById(id);
  if (restaurant === null) {
    return response.status(404).send({ error: "restaurant not found" });
  }
  return response.status(200).send(formatRestaurant(restaurant));
});

app.get("/reservations", checkJwt, async (request, response) => {
  const { auth } = request;
    const reservations = await ReservationModel.find({
      userId: auth.payload.sub,
    });
    const formattedReservations = reservations.map((reservation) =>
      formatReservation(reservation)
    );
    return response.status(200).send(formattedReservations);
});

app.get("/reservations/:id", checkJwt, async (request, response) => {
  const { id } = request.params;
  const { auth } = request;
  if (!validId(id)) {
    return response.status(400).send({ error: "invalid id is provided" });
  }
  const requested = await ReservationModel.findById(id);
  if (requested === null) {
    return response.status(404).send({ error: "not found" });
  }
  const reservations = await ReservationModel.find({
    userId: auth.payload.sub,
  });
  if (reservations.length === 0) {
    return response.status(403).send({
      error: "user does not have permission to access this reservation",
    });
  }
  let authorized = false;
  if (reservations[0].userId === requested.userId) {
    authorized = true;
  }
  if (authorized) {
    return response.status(200).send(formatReservation(requested));
  }
  if (!authorized) {
    return response.status(403).send({
      error: "user does not have permission to access this reservation",
    });
  }
});

app.post(
  "/reservations",
  checkJwt,
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
      return response.status(201).send(formatReservation(bookReservation));
    } catch (error) {
      next(error);
    }
  }
);

app.use(errors());

module.exports = app;

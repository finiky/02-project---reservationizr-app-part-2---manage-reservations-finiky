const express = require("express");
const cors = require("cors");
const app = express();
const { celebrate, Joi, errors, Segments } = require("celebrate");
const RestaurantModel = require("./models/RestaurantModel");
const formatRestaurant = require("./utils/formatRestaurants");
const validId = require("./utils/validId");
// const ReservationModel = require("./models/ReservationModel");

app.use(cors());
app.use(express.json());

app.get("/restaurants", async (request, response, next) => {
  try {
    const restaurants = await RestaurantModel.find({});
    const formattedRestaurants = restaurants.map((restaurant) =>
      formatRestaurant(restaurant)
    );
    response.status(200).send(formattedRestaurants);
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

app.get("/restaurants/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    if (validId(id) === false) {
      throw new Error("id provided is invalid");
    } else {
      try {
        const restaurant = await RestaurantModel.findById(id);
        if (undefined) {
          throw new Error("id not found");
        } else {
          return response.status(200).send(formatRestaurant(restaurant));
        }
      } catch (error) {
        error.status = 404;
        next(error);
      }
    }
  } catch (error) {
    error.status = 400;
    next(error);
  }
});
app.use(errors());

module.exports = app;

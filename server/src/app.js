const express = require("express");
const cors = require("cors");
const app = express();
const RestaurantModel = require("./models/RestaurantModel");
const formatRestaurant = require("./utils/formatRestaurants");
//const ReservationModel = require("./models/ReservationModel");

app.use(cors());
app.use(express.json());

app.get("/restaurants", async (requset, response) => {
  const restaurants = await RestaurantModel.find({});
  const formattedRestaurants = restaurants.map( (restaurant) => formatRestaurant(restaurant));
  response.status(200).send(formattedRestaurants);
});

module.exports = app;

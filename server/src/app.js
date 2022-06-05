const express = require("express");
const cors = require("cors");
const app = express();
const RestaurantModel = require("./models/RestaurantModel");
const ReservationModel = require("./models/ReservationModel");

app.use(cors());
app.use(express.json());

app.get("/restaurants", async (requset, response) => {
  const restaurants = await RestaurantModel.find({});
  response.status(201).send(restaurants);
});

module.exports = app;

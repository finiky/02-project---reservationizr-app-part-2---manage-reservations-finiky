import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateReservation from "./CreateReservation";
import "./Restaurant.css";

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:5001/restaurants/${id}`);
      const data = await response.json();
      setRestaurant(data);
    };
    fetchData();
  }, [id]);
  return (
    <div className="singleResContainer">
      <div className="image_information">
        <div className="imageContainer1">
          <img
            className="image1"
            src={restaurant.image}
            alt={restaurant.name}
          />
        </div>
        <div className="information1">
          <h2 className="name1">{restaurant.name}</h2>
          <p className="description1">{restaurant.description}</p>
        </div>
      </div>
      <CreateReservation restaurantName={restaurant.name} id={restaurant.id} />
    </div>
  );
};

export default Restaurant;

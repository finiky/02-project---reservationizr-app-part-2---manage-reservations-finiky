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
    <div>
      <div className="imageContainer">
      <img className="image" src={restaurant.image} alt={restaurant.name}/>
      </div>
      <div className="information">
      <h2 className="name singleRes">{restaurant.name}</h2>
      <p className="description">{restaurant.description}</p>
      </div>
      <CreateReservation restaurantName={restaurant.name} id={restaurant.id} />
    </div>
  );
};

export default Restaurant;

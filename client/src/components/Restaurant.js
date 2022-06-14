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
      <img src={restaurant.image} alt={restaurant.name}/>
      <h2>{restaurant.name}</h2>
      <p>{restaurant.description}</p>
      <CreateReservation restaurantName={restaurant.name} id={restaurant.id} />
    </div>
  );
};

export default Restaurant;

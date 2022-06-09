import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateReservation from "./CreateReservation";
import "./Restaurant.css";

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:5001/restaurants/${id}`);
      const data = await response.json();
      setRestaurant(data);
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <img src={restaurant.image} alt={restaurant.name}></img>
      <h2>{restaurant.name}</h2>
      <description>{restaurant.description}</description>
      <CreateReservation restaurantName={restaurant.name} id={id} />
    </div>
  );
};

export default Restaurant;

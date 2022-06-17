import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateReservation from "./CreateReservation";
import "./Restaurant.css";

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/restaurants/${id}`
      );
      if (response.status === 400) {
        setInvalid(true);
        setNotFound(false);
        setIsLoading(false);
      } else if (response.ok) {
        const data = await response.json();
        setRestaurant(data);
        setNotFound(false);
        setIsLoading(false);
        setInvalid(false);
      } else {
        setNotFound(true);
        setIsLoading(false);
        setInvalid(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (notFound) {
    return (
      <>
        <p>The restaurant trying to be retrieved does not exists.</p>
      </>
    );
  }

  if (invalid) {
    return (
      <>
        <p>Invalid ID is provided</p>
      </>
    );
  }
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

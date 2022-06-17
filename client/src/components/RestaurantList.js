import "./RestaurantList.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const url = `${process.env.REACT_APP_API_URL}/restaurants`;
      let data = await fetch(url);
      data = await data.json();
      setRestaurants(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="main">
      <h1 className="heading">Restaurants</h1>
      <ul className="restaurants">
        {restaurants.map(({ image, name, description, id }) => {
          return (
            <li key={id} className="restaurant">
              <div className="imageContainer">
                <img className="image" src={image} alt={name}></img>
              </div>
              <div className="information">
                <h2 className="name">{name}</h2>
                <p className="description">{description}</p>
                <Link to={`/restaurants/${id}`} className="link">
                  Reserve now &rarr;
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RestaurantList;

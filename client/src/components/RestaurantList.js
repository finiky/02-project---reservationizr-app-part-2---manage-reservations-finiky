import "./RestaurantList.css";
import React, { useState, useEffect } from "react";
const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const url = "http://localhost:5001/restaurants";
      let data = await fetch(url);
      data = await data.json();
      setRestaurants(data);
    };
    fetchData();
  }, []);
  return (
    <div className="main">
      <h1 className="heading">Restaurants</h1>
      <ul className="restaurants">
        {restaurants.map(({ image, name, description, id }) => {
          const link = `http://localhost:3000/restaurants/${id}`;
          return (
            <li key={id} className="restaurant">
              <div className="imageContainer">
                <img className="image" src={image} alt={name}></img>
              </div>
              <h2 className="name">{name}</h2>
              <p className="description">{description}</p>

              <a className="link" href={link}>
                Reserve now &rarr;
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RestaurantList;

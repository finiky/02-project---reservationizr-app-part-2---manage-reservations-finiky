import "./ReservationList.css";
import { formatDate } from "../utils/formatDate";
import React, { useState, useEffect } from "react";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const fetchUrl = "http://localhost:5001/reservations";
      const response = await fetch(fetchUrl);
      const data = await response.json();
      setReservations(data);
    };
    fetchData();
  }, []);
  if (reservations.length === 0) {
    return <>
      <p>You don't have any reservations</p>
      <a href="http://localhost:3000">View the restaurants</a>
    </>
  }
  return (
    <>
      <h1>Upcoming reservations</h1>
      <ul>
        {reservations.map(({ restaurantName, date, id }) => {
          return (
            <li key={id}>
              <h2>{restaurantName}</h2>
              <p>{formatDate(date)}</p>
              <a href={`http://localhost:3000/reservations/${id}`}>View details</a>
            </li>
          )
        })}
      </ul>
    </>
  );
};

export default ReservationList;

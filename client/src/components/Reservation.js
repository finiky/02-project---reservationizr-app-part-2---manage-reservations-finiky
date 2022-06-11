import { useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import "./Reservation.css";
import React, { useState, useEffect } from "react";
const Reservation = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState({});
  useEffect(() => {
    const fetchReservation = async () => {
      const fetchUrl = `http://localhost:5001/reservations/${id}`;
      const response = await fetch(fetchUrl);
      const data = await response.json();
      data.date = formatDate(data.date);
      setReservation(data);
    };
    fetchReservation();
  }, []);

  return (
    <>
      <h1>Reservation</h1>
      <h2>{reservation.restaurantName}</h2>
      <p>{reservation.date}</p>
      <p><b>Party Size:</b> {reservation.partySize}</p>
      <a href="http://localhost:5001/reservations">Back to reservations</a>
    </>
  );
};

export default Reservation;

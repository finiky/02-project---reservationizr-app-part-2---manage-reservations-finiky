import { useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import "./Reservation.css";
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
const Reservation = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState({});
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const fetchReservation = async () => {
      const accessToken = await getAccessTokenSilently();
      const fetchUrl = `http://localhost:5001/reservations/${id}`;
      const response = await fetch(fetchUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      data.date = formatDate(data.date);
      setReservation(data);
    };
    fetchReservation();
  }, [id, getAccessTokenSilently]);

  if (!("restaurantName" in reservation)) {
    return (
      <>
        <p claasName="notfound">Sorry! We can't find that reservation</p>
        <a className="linkReser" href="http://localhost:3000/reservations">
          &larr; Back to reservations
        </a>
      </>
    );
  }

  return (
    <>
      <div className="infoReser">
        <h1 className="headReser">Reservation</h1>
        <h2 className="nameReser">{reservation.restaurantName}</h2>
        <p className="dateReser">{reservation.date}</p>
        <p className="partySizeReser">
          <b>Party Size:</b> {reservation.partySize}
        </p>
      </div>
      <a className="linkReser" href="http://localhost:3000/reservations">
        &larr; Back to reservations
      </a>
    </>
  );
};

export default Reservation;

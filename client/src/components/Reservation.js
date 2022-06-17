import { useParams, Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import "./Reservation.css";
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
const Reservation = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const fetchReservation = async () => {
      setIsLoading(true);
      const accessToken = await getAccessTokenSilently();
      const fetchUrl = `${process.env.REACT_APP_API_URL}/reservations/${id}`;
      const response = await fetch(fetchUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        data.date = formatDate(data.date);
        setReservation(data);
        setNotFound(false);
        setIsLoading(false);
      } else {
        setNotFound(true);
        setIsLoading(false);
      }
    };
    fetchReservation();
  }, [id, getAccessTokenSilently]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (notFound) {
    return (
      <>
        <div className="noReser">
          <p className="notFound">Sorry! We can't find that reservation</p>
          <Link className="linkReser" to="/reservations">
            &larr; Back to reservations
          </Link>
        </div>
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

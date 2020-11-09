import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const FetchListItem = ({ link, date, type, category }) => {
  return (
    <div className="List center">
      <Link to={link}>{link}</Link>
      <div>{date}</div>
      <div>{type}</div>
      <div>{category}</div>
    </div>
  );
};

export default FetchListItem;

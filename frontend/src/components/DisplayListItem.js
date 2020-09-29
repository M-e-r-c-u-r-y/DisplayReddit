import React from "react";
import "../App.css";

const DisplayListItem = ({ body, selftext, author, permalink, score }) => {
  return (
    <div className="List">
      <div>
        {body
          ? body.split("\n").map((item, i) => {
              return <div key={i}>{item}</div>;
            })
          : selftext.split("\n").map((item, i) => {
              return <div key={i}>{item}</div>;
            })}
      </div>
      <a href={permalink} target="_blank" rel="noopener noreferrer">
        {permalink}
      </a>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div>{author}</div>
        <div style={{ paddingLeft: "10px" }}>{score}</div>
      </div>
    </div>
  );
};

export default DisplayListItem;

import React from "react";
import "../App.css";
import TagItem from "./TagItem";

const DisplayListItem = ({
  id,
  body,
  title,
  selftext,
  author,
  permalink,
  score,
  options,
}) => {
  // console.log(options);
  const type = body === undefined ? "posts" : "comments";
  return (
    <div className="List">
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div>{score}</div>
      </div>
      <h1>{title ? title : null}</h1>
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
        <a href={author} target="_blank" rel="noopener noreferrer">
          {author}
        </a>
      </div>
      {options.map((option) => (
        <TagItem key={option.name} id={id} type={type} {...option} />
      ))}
    </div>
  );
};

export default DisplayListItem;

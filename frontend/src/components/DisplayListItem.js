import React from "react";
import "../App.css";
import TagItem from "./TagItem";
import { useSelector } from "react-redux";
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
  let classes = "List";
  let tagClass = "";
  let tag = useSelector((state) => state.tags).filter((tag) => tag.id === id);
  if (tag.length > 0) {
    tagClass =
      tag[0].data.length === options.length ? "completed-item" : "error-item";
  }
  // console.log(tags, id);
  classes += " " + tagClass;
  return (
    <div className={classes}>
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

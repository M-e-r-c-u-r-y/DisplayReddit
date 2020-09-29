import React from "react";
import "../App.css";

const DisplayOptions = ({ onChange, options }) => {
  return (
    <select className="select-css" onChange={onChange}>
      {options.map((tab) => (
        <option key={tab.value} value={tab.value}>
          {tab.text}
        </option>
      ))}
    </select>
  );
};

export default DisplayOptions;

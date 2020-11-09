import React from "react";
import "../App.css";
import { Select } from "antd";

const { Option } = Select;

const DisplayOptions = ({ onChange, options, styles, defaultValue }) => {
  return (
    <Select style={styles} defaultValue={defaultValue} onChange={onChange}>
      {options.map((tab) => (
        <Option key={tab.value} value={tab.value}>
          {tab.text}
        </Option>
      ))}
    </Select>
  );
};

export default DisplayOptions;

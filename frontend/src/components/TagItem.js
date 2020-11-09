import React from "react";
import { Checkbox, Radio, Row, Col } from "antd";
import "../App.css";

import { useDispatch } from "react-redux";
import { addTag } from "../features/taggers/taggersSlice";

const TagItem = ({ name, values, optionType, id, type }) => {
  const dispatch = useDispatch();
  // console.log(id, type);
  function onCheckboxChange(checkedValues) {
    dispatch(
      addTag({
        id: id,
        datatype: type,
        item: { value: checkedValues, name: name },
      })
    );
    // console.log("checked = ", checkedValues);
  }

  function onRadioChange(e) {
    dispatch(
      addTag({
        id: id,
        datatype: type,
        item: { value: e.target.value, name: name },
      })
    );
    // console.log("radio checked =", e.target.value);
  }

  const data = values.map((option) => ({
    label: option,
    value: option,
  }));

  let result = null;
  switch (optionType) {
    case "checkbox":
      result = <Checkbox.Group options={data} onChange={onCheckboxChange} />;
      break;
    case "radiobutton":
      result = (
        <Radio.Group
          options={data}
          onChange={onRadioChange}
          optionType="button"
          buttonStyle="solid"
        />
      );
      break;
    default:
      break;
  }

  return (
    <Row>
      <Col span={8}>{name}</Col>
      <Col span={16}>{result}</Col>
    </Row>
  );
};

export default TagItem;

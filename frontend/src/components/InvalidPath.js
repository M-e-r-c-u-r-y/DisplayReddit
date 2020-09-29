import React from "react";

const InvalidPath = ({ error }) => {
  return <pre>{JSON.stringify(error, null, 2)}</pre>;
};

export default InvalidPath;

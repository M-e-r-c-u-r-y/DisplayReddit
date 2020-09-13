import React from "react";

const FailedScreen = ({ status, statusText }) => {
  return (
    <>
      <div>Status: {status}</div>
      <div>Status Text: {statusText}</div>
    </>
  );
};

export default FailedScreen;

import React, { useState, useEffect } from "react";

import useFetchData from "../hooks/useFetchData";

import Loading from "./Loading";
import FailedScreen from "./FailedScreen";
import FetchListItem from "./FetchListItem";
import InvalidPath from "./InvalidPath";
import DisplayOptions from "./DisplayOptions";

const FetchBackendData = () => {
  const domain = "http://127.0.0.1:8000";
  const path = "/display";
  const result = useFetchData(domain + path);
  const [output, setOutput] = useState([]);
  const [sortType, setSortType] = useState("time");
  const options = [
    { value: "time", text: "Time" },
    { value: "comments", text: "Comments" },
    { value: "submissions", text: "Submissions" },
  ];

  const sortoptions =
    result.loading || result.fetch === "failed" || result.error ? null : (
      <DisplayOptions
        onChange={(e) => setSortType(e.target.value)}
        options={options}
      />
    );
  // Update items display order based on sort criteria selected
  useEffect(() => {
    if (
      !(
        result.hasOwnProperty("loading") ||
        result.hasOwnProperty("fetch") ||
        result.hasOwnProperty("error")
      )
    ) {
      const displaydomain = "/";
      let sorted = null;
      if (sortType === "comments") {
        sorted = [...result].sort((a, b) => (a.type > b.type ? 1 : -1));
      } else if (sortType === "submissions") {
        sorted = [...result].sort((a, b) => (b.type > a.type ? 1 : -1));
      } else if (sortType === "time") {
        sorted = [...result].sort(function (a, b) {
          let c = new Date(a.time);
          let d = new Date(b.time);
          return d - c;
        });
      }
      setOutput(
        sorted.map((item) => (
          <FetchListItem
            key={item.path}
            link={displaydomain + item.path}
            date={new Date(item.time).toUTCString()}
            type={item.type}
            category={item.category}
          />
        ))
      );
    }
  }, [sortType, result]);

  useEffect(() => {
    // Display Loading screen while fetching data from server
    if (result.loading) {
      setOutput(<Loading />);
    }

    // If the result of fetch is failed, display the error text
    else if (result.fetch === "failed") {
      const { status, statusText } = result;
      setOutput(<FailedScreen status={status} statusText={statusText} />);
    } else if (!result.error) {
      result.sort(function (a, b) {
        let c = new Date(a.time);
        let d = new Date(b.time);
        return d - c;
      });
    } else {
      //Display invalid path if an Invalid route is accessed
      setOutput(<InvalidPath error={result.error} />);
    }
  }, [result]);

  return (
    <>
      {sortoptions}
      {output}
    </>
  );
};

export default FetchBackendData;

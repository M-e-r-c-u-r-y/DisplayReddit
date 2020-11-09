import React, { useState, useEffect } from "react";

import useFetchData from "../hooks/useFetchData";

import Loading from "./Loading";
import FailedScreen from "./FailedScreen";
import FetchListItem from "./FetchListItem";
import InvalidPath from "./InvalidPath";
import DisplayOptions from "./DisplayOptions";
import { useSelector, useDispatch } from "react-redux";
import { setVisibilitySorter } from "../features/sorters/sortersSlice";

const FetchBackendData = () => {
  const domain = "http://localhost:8000/api/v2";
  const path = "/display";
  const result = useFetchData(domain + path);
  const [output, setOutput] = useState([]);
  const defaultValue = useSelector((state) => state.visibilitySorter);
  const [sortType, setSortType] = useState(defaultValue);
  const dispatch = useDispatch();
  const options = [
    { value: "time", text: "Time" },
    { value: "comments", text: "Comments" },
    { value: "posts", text: "Posts" },
  ];

  const sortoptions =
    result.loading || result.fetch === "failed" || result.error ? null : (
      <DisplayOptions
        styles={{ width: 120, paddingTop: 5 }}
        onChange={(value) => {
          setSortType(value);
          // dispatch({ type: "VisibilityFilter", payload: value });
          dispatch(
            // visibilityFilter({ type: "VisibilityFilter", payload: value })
            setVisibilitySorter(value)
          );
        }}
        options={options}
        defaultValue={defaultValue}
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
        sorted = [...result].sort((a, b) => (a.datatype > b.datatype ? 1 : -1));
      } else if (sortType === "posts") {
        sorted = [...result].sort((a, b) => (b.datatype > a.datatype ? 1 : -1));
      } else if (sortType === "time") {
        sorted = [...result].sort(function (a, b) {
          let c = new Date(a.fetched_utc);
          let d = new Date(b.fetched_utc);
          return d - c;
        });
      }
      setOutput(
        sorted.map((item) => (
          <FetchListItem
            key={item.datapath}
            link={displaydomain + item.datapath}
            date={new Date(item.fetched_utc).toUTCString()}
            type={item.datatype}
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
        let c = new Date(a.fetched_utc);
        let d = new Date(b.fetched_utc);
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

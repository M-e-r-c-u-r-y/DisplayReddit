import React, { useState, useEffect } from "react";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";

import useFetchData from "../hooks/useFetchData";

import Loading from "./Loading";
import FailedScreen from "./FailedScreen";
import DisplayListItem from "./DisplayListItem";
import InvalidPath from "./InvalidPath";
import Button from "./Button";

const DisplayBackendData = ({ location: { search, pathname } }) => {
  const domain = "http://127.0.0.1:8000";
  const maxrows = 5;
  let history = useHistory();
  let location = useLocation();

  const [pathparams, setPathParams] = useState({
    nrows: maxrows,
    skiprows:
      Number({ ...queryString.parse(search) }.skiprows) >= maxrows
        ? Number({ ...queryString.parse(search) }.skiprows)
        : "None",
  });

  const path = pathname + `?${queryString.stringify(pathparams)}`;

  const result = useFetchData(domain + path);
  const [output, setOutput] = useState([]);
  const [nextItems, setNextItems] = useState(null);
  const [prevItems, setPrevItems] = useState(null);

  // Push path to history queue as needed
  useEffect(() => {
    if (history.action !== "POP" || result.loading === true) {
      history.push(path);
    }
  }, [history, path, result.loading]);

  // For progressing through history via next/prev and browser back/forward buttons
  useEffect(() => {
    if (history.action === "POP") {
      const locationparsed = {
        ...queryString.parse(location.search),
      };
      locationparsed.skiprows =
        Number(locationparsed.skiprows) >= 5
          ? Number(locationparsed.skiprows)
          : "None";
      locationparsed.nrows = pathparams.nrows;
      if (locationparsed.skiprows !== pathparams.skiprows) {
        setPathParams(locationparsed);
      }
    }
  }, [location, history, pathparams]);

  // For rendering the page based on result of fetch
  useEffect(() => {
    // Display Loading screen while fetching data from server
    if (result.loading === true) {
      setOutput(<Loading />);
    }

    // If the result of fetch is failed, display the error text
    else if (result.fetch === "failed") {
      const { status, statusText } = result;
      setOutput(<FailedScreen status={status} statusText={statusText} />);
    }

    //Display the items if the fetch is successful
    else if (!result.error) {
      const listItems = result.map((result) => (
        <DisplayListItem
          key={result.permalink}
          body={result.body}
          selftext={result.selftext}
          author={result.author}
          permalink={result.permalink}
          score={result.score}
        />
      ));

      setOutput(listItems);
    } else {
      //Display invalid path if an Invalid route is accessed
      setOutput(<InvalidPath error={result.error} />);
    }
  }, [result]);

  // For creating next and back buttons as necessary
  useEffect(() => {
    const nextClick = () => {
      if (history.action === "POP") {
        history.push(path);
      }
      setPathParams({
        ...pathparams,
        skiprows: Number(pathparams.skiprows)
          ? Number(pathparams.skiprows) + maxrows
          : maxrows,
      });
    };

    const prevClick = () => {
      if (history.action === "POP") {
        history.push(path);
      }
      setPathParams({
        ...pathparams,
        skiprows:
          Number(pathparams.skiprows) !== maxrows && Number(pathparams.skiprows)
            ? Number(pathparams.skiprows) - maxrows
            : "None",
      });
    };
    setNextItems(
      result.loading || result.fetch === "failed" || result.error ? null : (
        <Button onClick={nextClick} text="Next" />
      )
    );
    setPrevItems(
      result.loading ||
        result.fetch === "failed" ||
        result.error ? null : pathparams.skiprows !== "None" ? (
        <Button onClick={prevClick} text="Prev" />
      ) : null
    );
  }, [pathparams, history, path, result.loading, result.fetch, result.error]);
  return (
    <>
      {output}
      {prevItems}
      {nextItems}
    </>
  );
};

export default DisplayBackendData;

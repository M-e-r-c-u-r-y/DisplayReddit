import React, { useState, useEffect, useRef } from "react";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetTags } from "../features/taggers/taggersSlice";

import useFetchData from "../hooks/useFetchData";

import Loading from "./Loading";
import FailedScreen from "./FailedScreen";
import DisplayListItem from "./DisplayListItem";
import InvalidPath from "./InvalidPath";
import { Button, Space } from "antd";
import { Row, Col } from "antd";

const DisplayBackendData = ({ location: { search, pathname } }) => {
  const domain = "http://localhost:8000/api/v1";
  const maxrows = 5;
  let history = useHistory();
  let location = useLocation();
  const ButtonClicks = useRef(null);
  const tags = useSelector((state) => state.tags);
  const dispatch = useDispatch();

  const [pathparams, setPathParams] = useState({
    nrows: maxrows,
    skiprows:
      Number({ ...queryString.parse(search) }.skiprows) >= maxrows
        ? Number({ ...queryString.parse(search) }.skiprows)
        : 0,
  });

  const path = pathname + `?${queryString.stringify(pathparams)}`;

  const result = useFetchData(domain + path);
  const [output, setOutput] = useState([]);
  const nextClick = async () => {
    let tagsLength = 0;
    for (let i = 0; i < tags.length; i++) {
      const item = tags[i];
      tagsLength += item.data.length;
    }

    console.log(tagsLength);
    if (tagsLength === 15) {
      const res = await fetch(domain + "/tagged/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tags),
      });
      const result = await res.json();
      if (result.success) {
        console.log("Successfully processed data");
        dispatch(resetTags());
        if (history.action === "POP") {
          history.push(path);
        }
        setPathParams({
          ...pathparams,
          skiprows: Number(pathparams.skiprows)
            ? Number(pathparams.skiprows) + maxrows
            : maxrows,
        });
        setTimeout(() => {
          ButtonClicks.current.scrollIntoView({ behavior: "smooth" });
        }, 300);
      } else {
        // Todo: Must display the error in UI
        console.log("Error in processing data");
        console.log(result);
      }
    } else {
      // Todo: Must take UI to first element not tagged
      console.log("All items are not tagged");
    }
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
          : 0,
    });
    setTimeout(() => {
      ButtonClicks.current.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

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
          : 0;
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
      const data = result.data;
      const listItems = data.map((item) => (
        <DisplayListItem
          key={item.id}
          id={item.id}
          body={item.body}
          title={item.title}
          selftext={item.selftext}
          author={item.author}
          permalink={item.permalink}
          score={item.score}
          options={result.options}
        />
      ));

      setOutput(listItems);
    } else {
      //Display invalid path if an Invalid route is accessed
      setOutput(<InvalidPath error={result.error} />);
    }
  }, [result]);

  return (
    <>
      {output}
      <div ref={ButtonClicks}>
        <Row justify="center" align="middle">
          <Col span={6} offset={3}>
            <Space style={{ paddingTop: 5 }}>
              {result.loading ||
              result.fetch === "failed" ||
              result.error ? null : pathparams.skiprows !== 0 ? (
                <Button
                  size="large"
                  onClick={prevClick}
                  type="primary"
                  shape="round"
                >
                  Prev
                </Button>
              ) : null}
              {result.loading ||
              result.fetch === "failed" ||
              result.error ? null : (
                <Button
                  size="large"
                  onClick={nextClick}
                  type="primary"
                  shape="round"
                >
                  Next
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default DisplayBackendData;

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
import { Button, Space, notification, BackTop } from "antd";
import { Row, Col } from "antd";

const DisplayBackendData = ({ location: { search, pathname } }) => {
  const domain = "http://localhost:8000/api/v1";
  const maxrows = 5;
  let history = useHistory();
  let location = useLocation();
  const ButtonClicks = useRef(null);
  const tags = useSelector((state) => state.tags);
  const dispatch = useDispatch();
  const openNotificationWithIcon = (type) => {
    const message =
      type === "warning"
        ? "All items are not tagged"
        : type === "success"
        ? "Saved to DB"
        : null;
    const description =
      type === "warning"
        ? "Please recheck the taggings and proceed further"
        : type === "success"
        ? ""
        : null;
    const duration = type === "warning" ? 2 : type === "success" ? 1 : null;
    notification[type]({
      message: message,
      description: description,
      duration: duration,
    });
  };

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
    if (tagsLength === result.data_len * result.options_len) {
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
        openNotificationWithIcon("success");
        setTimeout(() => {
          ButtonClicks.current.scrollIntoView({ behavior: "smooth" });
        }, 300);
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
      } else {
        // Todo: Must display the error in UI
        console.log("Error in processing data");
        console.log(result);
      }
    } else {
      // Display warning message that all items are not tagged
      openNotificationWithIcon("warning");
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
      <div ref={ButtonClicks}>
        {output}
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
        <BackTop />
      </div>
    </>
  );
};

export default DisplayBackendData;

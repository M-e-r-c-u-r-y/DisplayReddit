import { useState, useEffect } from "react";
import ServerFailureMessage from "../components/ServerFailureMessage";

const useFetchData = (url, options) => {
  const [response, setResponse] = useState({ loading: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options);
        const json = await response.json();
        if (response.status >= 200 && response.status < 300) {
          setResponse(json);
        } else {
          setResponse({
            status: response.status,
            statusText: response.statusText,
            fetch: "failed",
          });
        }
      } catch (err) {
        setResponse({
          error: {
            detail: ServerFailureMessage,
          },
        });
      }
    };
    fetchData();
  }, [url, options]);
  return response;
};

export default useFetchData;

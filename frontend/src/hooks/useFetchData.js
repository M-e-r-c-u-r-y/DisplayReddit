import { useState, useEffect } from "react";
import ServerFailureMessage from "../components/ServerFailureMessage";

const useFetchData = (url, options) => {
  const [response, setResponse] = useState({ loading: true });

  useEffect(() => {
    const fetchData = async (url, options) => {
      try {
        const result = await fetch(url, options);
        const json = await result.json();
        if (result.status >= 200 && result.status < 300) {
          setResponse(json);
        } else {
          setResponse({
            status: result.status,
            statusText: result.statusText,
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
    fetchData(url, options);
  }, [url, options]);
  return response;
};

export default useFetchData;

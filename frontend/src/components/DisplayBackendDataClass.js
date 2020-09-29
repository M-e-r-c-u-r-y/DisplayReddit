import React from "react";

export default class DisplayBackendData extends React.Component {
  state = {
    loading: true,
    result: null,
  };

  async componentDidMount() {
    const domain = "http://127.0.0.1:8000";
    console.log(this.props.location);
    const path = this.props.location.pathname + this.props.location.search;
    console.log(domain + path);
    const response = await fetch(domain + path);
    const resdata = await response.json();

    this.setState({ result: resdata, loading: false });
  }

  render() {
    if (this.state.loading) {
      return <div>loading...</div>;
    }

    if (!this.state.result) {
      return <div>didn't get a response from the server</div>;
    }
    console.log(this.state.result);
    if (!this.state.result.error) {
      const listItems = this.state.result.map((result) => (
        <div
          key={result.permalink}
          style={{ border: "1px solid red", marginTop: "5px" }}
        >
          <div>{result.body ? result.body : result.selftext}</div>
          <div>{result.author}</div>
          <a href={result.permalink} target="_blank" rel="noopener noreferrer">
            {result.permalink}
          </a>
          <div>{result.score}</div>
        </div>
      ));
      return <>{listItems}</>;
    }

    return (
      <div>
        <pre>{JSON.stringify(this.state.result.error, null, 2)}</pre>
      </div>
    );
  }
}

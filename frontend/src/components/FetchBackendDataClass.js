import React from "react";
import { Link } from "react-router-dom";

export default class FetchBackendData extends React.Component {
  state = {
    loading: true,
    result: null,
  };

  async componentDidMount() {
    const domain = "http://127.0.0.1:8000";
    const displaydomain = "/";
    const path = "/display";
    const response = await fetch(domain + path);
    const result = await response.json();

    this.setState({
      result: result,
      loading: false,
      displaydomain: displaydomain,
    });
  }

  render() {
    if (this.state.loading) {
      return <div>loading...</div>;
    }

    if (!this.state.result) {
      return <div>didn't get a response from the server</div>;
    }

    const listItems = this.state.result.map((result) => (
      <div key={result.path}>
        <div>
          <Link to={this.state.displaydomain + result.path}>
            {this.state.displaydomain + result.path}
          </Link>
        </div>
        <div>{result.time}</div>
        <div>{result.type}</div>
        <div>{result.category}</div>
      </div>
    ));
    return (
      <>
        <div>{listItems}</div>
      </>
    );
  }
}

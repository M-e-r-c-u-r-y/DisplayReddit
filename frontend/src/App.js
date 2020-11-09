import React from "react";
import {
  Link,
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";
import FetchBackendData from "./components/FetchBackendData";
import DisplayBackendData from "./components/DisplayBackendData";

import { Layout, Menu } from "antd";
const { Header, Content } = Layout;

const App = () => {
  return (
    <div className="App">
      <Layout>
        <Router>
          <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
            <div className="logo" />
            <Menu defaultSelectedKeys={["1"]} theme="dark" mode="horizontal">
              <Menu.Item key="1">
                <Link to="/">Home</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content
            className="site-layout"
            style={{ padding: "0 50px", marginTop: 64 }}
          >
            <Route exact path="/" component={FetchBackendData} />
            <Route path="/data" component={DisplayBackendData} />
            <Route render={() => <Redirect to={{ pathname: "/" }} />} />
          </Content>
        </Router>
      </Layout>
    </div>
  );
};

export default App;

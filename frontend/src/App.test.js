import React from "react";
import { render, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders Home", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText("Home");
  expect(linkElement).toBeInTheDocument();
});

test("renders a page", async () => {
  const { getByText, findByText } = render(<App />);
  const linkElement = getByText("data", { exact: false });
  fireEvent.click(linkElement);
  const items = await findByText("reddit.com", { exact: false });
  expect(items).toHaveLength(5);
});

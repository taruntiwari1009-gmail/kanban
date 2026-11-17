import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  window.localStorage.clear();
});

test("renders the three workflow columns", () => {
  render(<App />);

  expect(screen.getByRole("heading", { name: "To Do" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "In Progress" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Completed" })).toBeInTheDocument();
});

test("adds a card to the selected column", () => {
  render(<App />);

  const addButtons = screen.getAllByRole("button", { name: "+ Add card" });
  fireEvent.click(addButtons[0]);

  expect(screen.getByDisplayValue("New card")).toBeInTheDocument();
});

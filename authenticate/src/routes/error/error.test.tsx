import Error from "./error";
import { expect, test, describe, vi } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useRouteError: () => ({
    error: "test_error",
    error_description: "Test error"
  })
}));

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<Error />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have header", () => {
    render(<Error />);
    const header = screen.getByRole("heading", { name: /Unable to authenticate/i });
    expect(header).toBeInTheDocument();
  });

  test("should have error", () => {
    render(<Error />);
    const error = screen.getByText(/Test error/i);
    expect(error).toBeInTheDocument();
  });
});

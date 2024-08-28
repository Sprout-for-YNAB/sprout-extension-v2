import Spinner from "./spinner";
import { expect, test, describe } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<Spinner />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should display spinner", () => {
    render(<Spinner />);
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toBeInTheDocument();
  });
});

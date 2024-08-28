import Splash from "./splash";
import { expect, test, describe } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<Splash />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have spinner", () => {
    render(<Splash />);
    const result = screen.getByTestId("spinner");
    expect(result).toBeInTheDocument();
  });
});

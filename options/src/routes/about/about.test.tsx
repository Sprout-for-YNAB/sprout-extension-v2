import About from "./about";
import { expect, test, describe } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<About />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have %s heading", () => {
    render(<About />);
    const heading = screen.getByRole("heading", { name: /About/i });
    expect(heading).toBeInTheDocument();
  });

  test.each([["YNAB is a trademark"], ["Update History"], ["Licenses"], ["Privacy Policy"]])(
    "should have %s text",
    (text) => {
      render(<About />);
      const textElement = screen.getByText(new RegExp(text, "i"));
      expect(textElement).toBeInTheDocument();
    }
  );
});

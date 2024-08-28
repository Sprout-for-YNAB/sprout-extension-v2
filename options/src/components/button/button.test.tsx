import Button from "./button";
import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, test, describe, vi } from "vitest";
import userEvent from "@testing-library/user-event";

const testFn = {
  returnString: () => {
    return "Test";
  }
};

const mockProps = {
  title: "Test button",
  description: "This is a button setting",
  id: "button-settings",
  label: "Button",
  disabled: false,
  onClick: vi.fn(() => testFn.returnString())
};

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<Button {...mockProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have correct title label", () => {
    render(<Button {...mockProps} />);
    const title = screen.getByLabelText(/Test button/i);
    expect(title).toBeInTheDocument();
  });

  test("should have correct description", () => {
    render(<Button {...mockProps} />);
    const description = screen.getByText(/This is a button setting/i);
    expect(description).toBeInTheDocument();
  });

  test("should have button text Button", () => {
    render(<Button {...mockProps} />);
    const button = screen.getByLabelText(/Test button/i);
    expect(button).toHaveValue("Button");
  });

  test("should be disabled", () => {
    render(<Button {...mockProps} disabled={true} />);
    const button = screen.getByLabelText(/Test button/i);
    expect(button).toBeDisabled();
  });
});

describe("Interaction", () => {
  test("should run onClick function", async () => {
    const user = userEvent.setup();
    render(<Button {...mockProps} />);
    const button = screen.getByLabelText(/Test button/i);
    const spy = vi.spyOn(testFn, "returnString");
    await waitFor(async () => {
      await user.click(button);
    });
    expect(spy).toHaveBeenCalled();
  });
});

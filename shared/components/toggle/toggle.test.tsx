import Toggle from "./toggle";
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
  title: "Test toggle",
  description: "This is a toggle setting",
  id: "toggle-settings",
  initialState: false,
  updateFn: vi.fn(() => testFn.returnString())
};

afterEach(() => {
  mockProps.initialState = false;
});

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<Toggle {...mockProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have correct title label", () => {
    render(<Toggle {...mockProps} />);
    const title = screen.getByLabelText(/Test toggle/i);
    expect(title).toBeInTheDocument();
  });

  test("should have correct description", () => {
    render(<Toggle {...mockProps} />);
    const description = screen.getByText(/This is a toggle setting/i);
    expect(description).toBeInTheDocument();
  });

  test("should be false", () => {
    render(<Toggle {...mockProps} />);
    const toggle = screen.getByLabelText(/Test toggle/i);
    expect(toggle).not.toBeChecked();
  });

  test("should be true", () => {
    mockProps.initialState = true;
    render(<Toggle {...mockProps} />);
    const toggle = screen.getByLabelText(/Test toggle/i);
    expect(toggle).toBeChecked();
  });
});

describe("Interaction", () => {
  test("should switch to true when clicked", async () => {
    const user = userEvent.setup();
    render(<Toggle {...mockProps} />);
    const toggle = screen.getByLabelText(/Test toggle/i);
    const spy = vi.spyOn(testFn, "returnString");
    await waitFor(async () => {
      await user.click(toggle);
    });
    expect(toggle).toBeChecked();
    expect(spy).toHaveBeenCalled();
  });

  test("should switch to false when clicked", async () => {
    mockProps.initialState = true;
    const user = userEvent.setup();
    render(<Toggle {...mockProps} />);
    const toggle = screen.getByLabelText(/Test toggle/i);
    const spy = vi.spyOn(testFn, "returnString");
    await waitFor(async () => {
      await user.click(toggle);
    });
    expect(toggle).not.toBeChecked();
    expect(spy).toHaveBeenCalled();
  });
});

import Select from "./select";
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
  title: "Test select",
  description: "This is a select setting",
  id: "select-settings",
  initialValue: "",
  options: [
    {
      name: "Option 1",
      value: "option-1"
    },
    {
      name: "Option 2",
      value: "option-2"
    },
    {
      name: "Option 3",
      value: "option-3"
    }
  ],
  hideDefault: false,
  updateFn: vi.fn(() => testFn.returnString())
};

afterEach(() => {
  mockProps.initialValue = "";
});

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<Select {...mockProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have correct title label", () => {
    render(<Select {...mockProps} />);
    const title = screen.getByLabelText(/Test select/i);
    expect(title).toBeInTheDocument();
  });

  test("should have correct description", () => {
    render(<Select {...mockProps} />);
    const description = screen.getByText(/This is a select setting/i);
    expect(description).toBeInTheDocument();
  });

  test("should have initial value of None", () => {
    render(<Select {...mockProps} />);
    const toggle = screen.getByLabelText(/Test select/i);
    expect(toggle).toHaveValue("");
  });

  test("should hide default option", () => {
    mockProps.hideDefault = true;
    render(<Select {...mockProps} />);
    const toggle = screen.getByLabelText(/Test select/i);
    expect(toggle).not.toHaveValue("");
    expect(toggle).toHaveValue("option-1");
  });

  test("should be true", () => {
    mockProps.initialValue = "option-1";
    render(<Select {...mockProps} />);
    const toggle = screen.getByLabelText(/Test select/i);
    expect(toggle).toHaveValue("option-1");
  });
});

describe("Interaction", () => {
  test.each([
    ["Option 1", "option-1"],
    ["Option 2", "option-2"],
    ["Option 3", "option-3"]
  ])("should select %s option", async (name, value) => {
    const user = userEvent.setup();
    render(<Select {...mockProps} />);
    const toggle = screen.getByLabelText(/Test select/i);
    const spy = vi.spyOn(testFn, "returnString");
    await waitFor(async () => {
      await user.selectOptions(toggle, value);
    });
    expect(toggle).toHaveValue(value);
    expect(spy).toHaveBeenCalled();
  });
});

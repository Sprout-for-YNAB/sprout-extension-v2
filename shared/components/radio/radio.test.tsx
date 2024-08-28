import Radio from "./radio";
import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, test, describe, vi } from "vitest";
import userEvent from "@testing-library/user-event";

let mockState = "option-2";

const mockModule = {
  setState: (newState: string) => {
    mockState = newState;
    return;
  }
};

const mockFirstProps = {
  label: "Test radio 1",
  value: "option-1",
  id: "option-1",
  name: "toggle-radio",
  checked: mockState === "option-1",
  updateFn: vi.fn(() => mockModule.setState("option-1"))
};

const mockSecondProps = {
  label: "Test radio 2",
  value: "option-2",
  id: "option-2",
  name: "toggle-radio",
  checked: mockState === "option-2",
  updateFn: vi.fn(() => mockModule.setState("option-2"))
};

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<Radio {...mockFirstProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have correct title label", () => {
    render(<Radio {...mockFirstProps} />);
    const title = screen.getByLabelText(/Test radio 1/i);
    expect(title).toBeInTheDocument();
  });

  test("should be false by default", () => {
    render(<Radio {...mockFirstProps} />);
    const radio = screen.getByLabelText(/Test radio 1/i);
    expect(radio).not.toBeChecked();
  });

  test("should be true by default", () => {
    render(<Radio {...mockSecondProps} />);
    const radio = screen.getByLabelText(/Test radio 2/i);
    expect(radio).toBeChecked();
  });
});

describe("Interaction", () => {
  test("should switch radio option", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Radio {...mockFirstProps} />
        <Radio {...mockSecondProps} />
      </>
    );
    const toggle1 = screen.getByLabelText(/Test radio 1/i);
    const toggle2 = screen.getByLabelText(/Test radio 2/i);
    expect(toggle1).not.toBeChecked();
    expect(toggle2).toBeChecked();
    const spy = vi.spyOn(mockModule, "setState");
    await waitFor(async () => {
      await user.click(toggle1);
    });
    expect(spy).toHaveBeenCalled();
    expect(mockState).toEqual("option-1");
    expect(toggle1).toBeChecked();
    expect(toggle2).not.toBeChecked();
  });
});

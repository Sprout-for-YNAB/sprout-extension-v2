import Behavior from "./behavior";
import { expect, test, describe, vi } from "vitest";
import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import { SettingsContext } from "@shared/types/app";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { budgetsLoader } from "loaders/budgetsLoader";

const mockOutletContext = {
  settings: {
    expandAutocomplete: false,
    lastBudget: false,
    defaultBudget: {}
  },
  updateSetting: vi.fn(),
  isLoggedIn: true
} as SettingsContext;

const router = createMemoryRouter([
  {
    path: "/",
    element: <Behavior />,
    loader: budgetsLoader
  }
]);

beforeAll(() => {
  vi.mock("react-router-dom", async () => ({
    ...(await vi.importActual("react-router-dom")),
    useOutletContext: () => mockOutletContext
  }));
});

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<RouterProvider router={router} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have heading", () => {
    render(<RouterProvider router={router} />);
    const heading = screen.getByRole("heading", { name: "Behavior" });
    expect(heading).toBeInTheDocument();
  });

  test.each([
    ["Automatically Expand Autocomplete Fields"],
    ["Open Last Selected Budget"],
    ["Open Specific Budget"]
  ])("should Behavior %s setting label", (label) => {
    render(<RouterProvider router={router} />);
    const labelElement = screen.getByLabelText(label);
    expect(labelElement).toBeInTheDocument();
  });
});

describe("Interaction", () => {
  test.each([["Automatically Expand Autocomplete Fields"], ["Open Last Selected Budget"]])(
    "should toggle %s setting to true",
    async (label) => {
      const user = userEvent.setup();
      render(<RouterProvider router={router} />);
      const labelElement = screen.getByLabelText(label);
      await waitFor(async () => {
        await user.click(labelElement);
      });
      expect(labelElement).toBeChecked();
    }
  );

  test.each([
    ["My budget", "budget-1"],
    ["My other budget", "budget-2"]
  ])("should select %s as default budget", async (name, value) => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const setting = screen.getByLabelText(/Open Specific Budget/i);
    await waitFor(async () => {
      await user.selectOptions(setting, value);
    });
    expect(setting).toHaveValue(value);
  });
});

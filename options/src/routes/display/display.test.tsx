import Display from "./display";
import { expect, test, describe, vi } from "vitest";
import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import { SettingsContext } from "@shared/types/app";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

const mockOutletContext = {
  settings: {
    accountBalances: true,
    categoryBalances: true,
    theme: "system"
  },
  updateSetting: vi.fn(),
  isLoggedIn: true
} as SettingsContext;

const router = createMemoryRouter([
  {
    path: "/",
    element: <Display />
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
    const heading = screen.getByRole("heading", { name: "Display" });
    expect(heading).toBeInTheDocument();
  });

  test.each([["Show Account Balances"], ["Show Category Balances"], ["Theme"]])(
    "should display %s setting label",
    (label) => {
      render(<RouterProvider router={router} />);
      const labelElement = screen.getByLabelText(label);
      expect(labelElement).toBeInTheDocument();
    }
  );
});

describe("Interaction", () => {
  test.each([["Show Account Balances"], ["Show Category Balances"]])(
    "should toggle %s setting to false",
    async (label) => {
      const user = userEvent.setup();
      render(<RouterProvider router={router} />);
      const labelElement = screen.getByLabelText(label);
      await waitFor(async () => {
        await user.click(labelElement);
      });
      expect(labelElement).not.toBeChecked();
    }
  );

  test.each([["system"], ["light"], ["dark"]])(
    "should select %s theme setting",
    async (themeSetting) => {
      const user = userEvent.setup();
      render(<RouterProvider router={router} />);
      const themeElement = screen.getByLabelText("Theme");
      await waitFor(async () => {
        await user.selectOptions(themeElement, themeSetting);
      });
      expect(themeElement).toHaveValue(themeSetting);
    }
  );
});

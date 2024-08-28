import Data from "./data";
import { expect, test, describe, vi } from "vitest";
import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import { SettingsContext } from "@shared/types/app";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

const mockOutletContext = {
  settings: {
    dataCaching: true
  },
  updateSetting: vi.fn(),
  isLoggedIn: true
} as SettingsContext;

const router = createMemoryRouter([
  {
    path: "/",
    element: <Data />
  }
]);

beforeAll(() => {
  vi.mock("react-router-dom", async () => ({
    ...(await vi.importActual("react-router-dom")),
    useOutletContext: () => mockOutletContext
  }));
});

afterEach(() => {
  mockOutletContext.settings = {
    dataCaching: true
  };
  mockOutletContext.isLoggedIn = true;
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
    const heading = screen.getByRole("heading", { name: "Data" });
    expect(heading).toBeInTheDocument();
  });

  test.each([["Cache data"], ["Clear cache"]])("should display %s setting label", (label) => {
    render(<RouterProvider router={router} />);
    const labelElement = screen.getByLabelText(label);
    expect(labelElement).toBeInTheDocument();
  });

  test("should not show Clear Cache if not logged in", () => {
    mockOutletContext.isLoggedIn = false;
    render(<RouterProvider router={router} />);
    const labelElement = screen.queryByLabelText(/Clear cache/i);
    expect(labelElement).not.toBeInTheDocument();
  });
});

describe("Interaction", () => {
  test("should toggle Cache Data setting to false", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const labelElement = screen.getByLabelText(/Cache Data/i);
    await waitFor(async () => {
      await user.click(labelElement);
    });
    expect(labelElement).not.toBeChecked();
  });
});

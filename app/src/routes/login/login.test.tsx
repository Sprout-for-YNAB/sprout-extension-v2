import Login from "./login";
import { expect, test, describe } from "vitest";
import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { loginLoader } from "loaders/loginLoader";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

const routes = [
  {
    path: "/login",
    element: <Login />,
    loader: loginLoader
  }
];

const router = createMemoryRouter(routes, { initialEntries: ["/login"] });

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<RouterProvider router={router} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have opening paragraph", () => {
    render(<RouterProvider router={router} />);
    const result = screen.getByText(
      "Sprout for YNAB allows you to quickly add a transaction to your budget without having to leave your current tab."
    );
    expect(result).toBeInTheDocument();
  });

  test("should have login button", () => {
    render(<RouterProvider router={router} />);
    const result = screen.getByRole("button", { name: "Log in with YNAB" });
    expect(result).toBeInTheDocument();
  });

  test("should have privacy policy link", () => {
    render(<RouterProvider router={router} />);
    const result = screen.getByRole("link", { name: "Privacy Policy" });
    expect(result).toHaveAttribute("href", "https://[WEBSITE_URL]/privacy");
  });
});

describe("Interaction", () => {
  test("should open new tab when login button is clicked", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const button = screen.getByRole("button", { name: "Log in with YNAB" });
    await waitFor(async () => {
      await user.click(button);
    });
    const hintText = screen.getByText(/You can close this extension/i);
    expect(browser.tabs.create).toHaveBeenCalledOnce();
    expect(hintText).toBeInTheDocument();
  });
});

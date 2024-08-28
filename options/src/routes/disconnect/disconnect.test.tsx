import Disconnect from "./disconnect";
import { expect, test, describe, vi } from "vitest";
import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<Disconnect />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have heading", () => {
    render(<Disconnect />);
    const heading = screen.getByRole("heading", { name: /Disconnect/i });
    expect(heading).toBeInTheDocument();
  });

  test("should have disconnect button", () => {
    render(<Disconnect />);
    const button = screen.getByRole("button", { name: /Disconnect/i });
    expect(button).toBeInTheDocument();
  });
});

describe("Interaction", () => {
  test("should open disconnect modal", async () => {
    const user = userEvent.setup();
    render(<Disconnect />);
    const button = screen.getByRole("button", { name: /Disconnect/i });
    await waitFor(async () => {
      await user.click(button);
    });
    const modal = screen.getByRole("dialog", { name: "Disconnect?" });
    expect(modal).toBeInTheDocument();
  });

  test("should disconnect user", async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(browser.cookies, "remove");
    render(<Disconnect />);
    const button = screen.getByRole("button", { name: /Disconnect/i });
    await waitFor(async () => {
      await user.click(button);
    });
    const confirm = screen.getByText("Yes");
    await waitFor(async () => {
      await user.click(confirm);
    });
    expect(spy).toHaveBeenCalledTimes(2);
    const accountSettingsButton = screen.getByText(/Open YNAB Account Settings/i);
    expect(accountSettingsButton).toBeInTheDocument();
  });
});

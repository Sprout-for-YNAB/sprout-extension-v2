import UpdateNoticeModal from "./modal";
import { expect, test, describe, vi } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";

const mockProps = {
  setShowModal: vi.fn()
};

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<UpdateNoticeModal {...mockProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have text", () => {
    render(<UpdateNoticeModal {...mockProps} />);
    const header = screen.getByText(/Version 2.0 is here!/i);
    const paragraph1 = screen.getByText(/Thank you for continuing to use/i);
    const paragraph2 = screen.getByText(/The extension has been rewritten from the ground up/i);
    const paragraph3 = screen.getByText(/Your existing settings have carried over/i);
    const paragraph4 = screen.getByText(/I apologize for the inconvenience/i);
    expect(header).toBeInTheDocument();
    expect(paragraph1).toBeInTheDocument();
    expect(paragraph2).toBeInTheDocument();
    expect(paragraph3).toBeInTheDocument();
    expect(paragraph4).toBeInTheDocument();
  });
});

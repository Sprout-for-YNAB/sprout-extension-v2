import Suggestions from "./suggestions";
import { mockCategories } from "@tests/mocks/budget";
import { expect, test, vi } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { WrapperProps } from "vite-env";
import { Selection } from "@shared/types/app";

const mockProps = {
  label: "Category",
  items: mockCategories,
  highlighted: {
    id: "category-1",
    name: "Category 1",
    index: {
      groupIndex: 0,
      itemIndex: 0
    }
  } as Selection,
  setHighlighted: vi.fn(),
  selectedId: "",
  selectItem: vi.fn(),
  showAddItem: false,
  value: "",
  fullscreen: false,
  showSubtransactionModal: vi.fn()
};

const wrapper = ({ children }: WrapperProps) => {
  const id = mockProps.label.toLowerCase();
  return (
    <>
      <label htmlFor={id}>{mockProps.label}</label>
      <input
        id={id}
        role="combobox"
        aria-controls={`${id}-input-list`}
        aria-autocomplete="list"
        aria-expanded={true}
      />
      {children}
    </>
  );
};

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<Suggestions {...mockProps} />, { wrapper });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test.each([[/Category Group 1/i], [/Category Group 2/i], [/Other Category/i]])(
    "should show group headers",
    (header) => {
      render(<Suggestions {...mockProps} />, { wrapper });
      const groupHeader = screen.getByText(header);

      expect(groupHeader).toBeInTheDocument();
    }
  );

  test.each([
    [/Category 1/i, /2000/i],
    [/Category 2/i, /75/i],
    [/Category 3/i, /333/i],
    [/Test Item/i, /250/i]
  ])("should show items and balances", (itemName, itemBalance) => {
    render(<Suggestions {...mockProps} />, { wrapper });
    const item = screen.getByText(itemName);
    const balance = screen.getByText(itemBalance);

    expect(item).toBeInTheDocument();
    expect(balance).toBeInTheDocument();
  });

  test("should highlight selected option", () => {
    render(<Suggestions {...mockProps} />, { wrapper });
    const highlightedItem = screen.getByText(/Category 1/i).closest("li");
    const notHighlightedItem = screen.getByText(/Category 2/i).closest("li");
    expect(highlightedItem).toHaveAttribute("data-highlighted", "true");
    expect(notHighlightedItem).toHaveAttribute("data-highlighted", "false");
  });

  test("should show No matching option", () => {
    mockProps.items = [];
    render(<Suggestions {...mockProps} />, { wrapper });
    const noMatchingOption = screen.getByText(/No matching/i);

    expect(noMatchingOption).toBeInTheDocument();
  });

  test("should show Create new option", () => {
    mockProps.showAddItem = true;
    mockProps.value = "test";
    render(<Suggestions {...mockProps} />, { wrapper });
    const addOption = screen.getByText(/Create new/i);

    expect(addOption).toBeInTheDocument();
  });
});

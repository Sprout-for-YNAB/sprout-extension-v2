import { filterItems } from "utils/filter";
import { test } from "vitest";
import { Group } from "@shared/types/ynab";

const mockItems: Group[] = [
  {
    name: "Group 1",
    items: [
      {
        id: "abc",
        name: "ABC"
      },
      {
        id: "def",
        name: "DEF"
      }
    ]
  },
  {
    name: "Group 2",
    items: [
      {
        id: "uvw",
        name: "UVW"
      }
    ]
  },
  {
    name: "Group 3",
    items: [
      {
        id: "xyz",
        name: "XYZ"
      }
    ]
  },
  {
    name: "Group 4",
    items: [
      {
        id: "itm-1",
        name: "Item 1"
      },
      {
        id: "itm-2",
        name: "Item 2"
      },
      {
        id: "itm-1",
        name: "Item 3"
      }
    ]
  }
];

test.each([["abc"], ["def"], ["uvw"], ["xyz"]])("should send back result matching %s", (query) => {
  const result = filterItems(query, mockItems);
  let found = false;
  result.forEach((group) => {
    group.items.forEach((item) => {
      if (item.name.toLowerCase().includes(query.toLowerCase())) {
        found = true;
      }
    });
  });
  expect(found).toBeTruthy();
});

test.each([["ab"], ["ef"], ["u"], ["x"]])("should send back result that includes %s", (query) => {
  const result = filterItems(query, mockItems);
  let found = false;
  result.forEach((group) => {
    group.items.forEach((item) => {
      if (item.name.toLowerCase().includes(query.toLowerCase())) {
        found = true;
      }
    });
  });
  expect(found).toBeTruthy();
});

test("should send back multiple similar results", () => {
  const result = filterItems("item", mockItems);
  let found = false;
  result.forEach((group) => {
    if (group.items.length > 1) {
      found = true;
    }
  });
  expect(found).toBeTruthy();
});

test("should send back no matching results", () => {
  const result = filterItems("jjjjj", mockItems);
  expect(result).toHaveLength(0);
});

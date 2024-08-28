import Fuse from "fuse.js";
import { Group } from "@shared/types/ynab";

const fuseOptions = {
  threshold: 0.25,
  keys: ["name"]
};

export const filterItems = (query: string, currentItems: Group[]) => {
  const newFilteredItems: Group[] = [];
  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    return currentItems;
  }
  for (const group of currentItems) {
    const fuse = new Fuse(group.items, fuseOptions);
    const results = fuse.search(query.trim());
    if (results.length > 0) {
      const newfilteredGroup = [];
      for (const result of results) {
        newfilteredGroup.push(result.item);
      }
      newFilteredItems.push({
        id: group.id,
        name: group.name,
        items: newfilteredGroup
      });
    }
  }
  return newFilteredItems;
};

// @ts-nocheck
import "@testing-library/jest-dom/vitest";
import { expect, vi } from "vitest";
import { toHaveNoViolations } from "jest-axe";

global.browser = {
  cookies: {
    get: () => {
      throw new Error("Not implemented");
    },
    remove: vi.fn().mockResolvedValue(null)
  },
  runtime: {
    getManifest: () => {
      return {
        name: "Sprout for YNAB",
        homepage_url: "https://[WEBSITE_URL]"
      };
    },
    getURL: () => "extension://sproutforynab"
  },
  storage: {
    session: {
      clear: vi.fn().mockResolvedValue(null)
    }
  },
  tabs: {
    create: vi.fn().mockResolvedValue(null)
  }
};

vi.mock("@app/api/authentication");
vi.mock("@app/loaders/budgetLoader");
vi.mock("@app/loaders/budgetsLoader");
vi.mock("@app/loaders/loginLoader");
vi.mock("@authenticate/loaders/authLoader");
vi.mock("@authenticate/loaders/budgetsLoader");
vi.mock("@options/loaders/loader");
vi.mock("@options/loaders/budgetsLoader");
vi.mock("@shared/hooks/useSettings");

expect.extend(toHaveNoViolations);

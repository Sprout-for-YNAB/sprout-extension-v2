import { ThemeSetting } from "@shared/types/app";

export const setTheme = (theme: ThemeSetting | undefined) => {
  switch (theme) {
    case "light":
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
      break;
    case "dark":
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
      break;
    default:
      document.body.classList.remove("light-theme");
      document.body.classList.remove("dark-theme");
      break;
  }
};

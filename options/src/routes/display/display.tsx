import { SettingsContext, ThemeSetting } from "@shared/types/app";
import Toggle from "@shared/components/toggle/toggle";
import { useOutletContext } from "react-router-dom";
import { strings } from "./display.strings";
import Select from "components/select/select";
import { setTheme } from "@shared/utils/theme";

export default function Display() {
  const { settings, updateSetting } = useOutletContext<SettingsContext>();
  const themeOptions = [
    { name: strings.theme.system, value: "system" },
    { name: strings.theme.light, value: "light" },
    { name: strings.theme.dark, value: "dark" }
  ];

  const updateShowAccountBalances = (newValue: boolean) => {
    updateSetting({ accountBalances: newValue });
  };

  const updateShowCategoryBalances = (newValue: boolean) => {
    updateSetting({ categoryBalances: newValue });
  };

  const updateThemeSetting = (newValue: string) => {
    const theme = newValue as ThemeSetting;
    updateSetting({ theme });
    setTheme(theme);
  };

  return (
    <section>
      <h2>Display</h2>
      <Toggle
        title={strings.accountBalances.title}
        description={strings.accountBalances.description}
        id={strings.accountBalances.title}
        initialState={settings.accountBalances}
        updateFn={updateShowAccountBalances}
      />
      <Toggle
        title={strings.categoryBalances.title}
        description={strings.categoryBalances.description}
        id={strings.categoryBalances.title}
        initialState={settings.categoryBalances}
        updateFn={updateShowCategoryBalances}
      />
      <Select
        title={strings.theme.title}
        description={strings.theme.description}
        id={strings.theme.id}
        initialValue={settings.theme ?? "system"}
        options={themeOptions}
        hideDefault
        updateFn={updateThemeSetting}
      />
    </section>
  );
}

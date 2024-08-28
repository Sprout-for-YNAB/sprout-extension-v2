import Nav from "components/nav/nav";
import styles from "./root.module.css";
import { Outlet, useLoaderData } from "react-router-dom";
import { Settings, SettingsContext } from "@shared/types/app";
import { getNamespace } from "@shared/utils/extensionApi";
import { useRef } from "react";

export default function Root() {
  const { settings, isLoggedIn } = useLoaderData() as SettingsContext;
  const currnetSettings = useRef(settings);

  const updateSetting = async (updatedSetting: Settings) => {
    const newSettings = {
      ...settings,
      ...updatedSetting
    };
    console.log("update setting", updatedSetting);
    await getNamespace().storage.sync.set({
      settings: newSettings
    });
    currnetSettings.current = newSettings;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Settings</h1>
      <div className={styles.grid}>
        <Nav />
        <main>
          <Outlet context={{ settings: currnetSettings.current, updateSetting, isLoggedIn }} />
        </main>
      </div>
    </div>
  );
}

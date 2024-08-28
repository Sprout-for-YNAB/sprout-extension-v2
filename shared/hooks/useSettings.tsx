import { getNamespace } from "../utils/extensionApi";
import { useEffect, useState } from "react";
import { Settings } from "../types/app";
import { reportError } from "../utils/error";

export default function useSettings() {
  const [settings, setSettings] = useState<Settings>();

  useEffect(() => {
    getNamespace()
      .storage.sync.get("settings")
      .then((res) => {
        setSettings(res.settings as Settings);
      })
      .catch(reportError);
  }, []);

  return { ...settings };
}

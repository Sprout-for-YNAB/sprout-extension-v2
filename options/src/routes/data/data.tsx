import { SettingsContext } from "@shared/types/app";
import { getNamespace } from "@shared/utils/extensionApi";
import { useOutletContext } from "react-router-dom";
import { reportError } from "@shared/utils/error";
import Toggle from "@shared/components/toggle/toggle";
import { strings } from "./data.strings";
import Button from "components/button/button";
import { useState } from "react";

export default function Data() {
  const { settings, updateSetting, isLoggedIn } = useOutletContext<SettingsContext>();
  const [clearButtonState, setClearButtonState] = useState({
    label: strings.clear.button.enabled,
    disabled: false
  });

  const updateDataCaching = (newValue: boolean) => {
    updateSetting({ dataCaching: newValue });
  };

  const clearCache = () => {
    getNamespace()
      .storage.session.clear()
      .then(() => {
        setClearButtonState({
          label: strings.clear.button.disabled,
          disabled: true
        });
      })
      .catch(reportError);
  };

  return (
    <section>
      <h2>Data</h2>
      <Toggle
        title={strings.cache.title}
        description={strings.cache.description}
        id={strings.cache.id}
        initialState={settings.dataCaching}
        updateFn={updateDataCaching}
      />
      {isLoggedIn && (
        <Button
          title={strings.clear.title}
          description={strings.clear.description}
          id={strings.clear.id}
          label={clearButtonState.label}
          disabled={clearButtonState.disabled}
          onClick={clearCache}
        />
      )}
    </section>
  );
}

import { getNamespace } from "@shared/utils/extensionApi";

const { name } = getNamespace().runtime.getManifest();

export const strings = {
  setting: {
    title: `Disconnect from ${name}`,
    description: `Disconnect your YNAB account and clear all data from ${name}.`,
    id: "disconnect",
    label: "Disconnect"
  },
  modal: {
    confirm: {
      title: "Disconnect?",
      body: `Are you sure you want to disconnect from ${name}?`,
      no: "No",
      yes: "Yes"
    },
    disconnected: {
      title: "Disconnected",
      body: `Your YNAB account has been disconnected. Thank you for using ${name}!`,
      deauthorize: `To fully deauthorize ${name} from your account, click the Revoke button by ${name} under Authorized Applications in your YNAB Account Settings.`,
      button: "Open YNAB Account Settings"
    }
  }
};

import { ProxyManager } from "@/helpers/proxy-manager";
import {
  DEFAULT_NGINX_SETTINGS,
  INginxSettings,
} from "@/helpers/proxy-manager/interfaces";
import { toast } from "sonner";
import { create } from "zustand";

interface NginxSettingsStore {
  settings: INginxSettings;
  loaded: boolean;
  load(): Promise<void>;
  updateSettings(settings: INginxSettings): Promise<void>;
  resetToDefaults(): Promise<void>;
}

const nginxSettingsStore = create<NginxSettingsStore>()((set) => ({
  settings: DEFAULT_NGINX_SETTINGS,
  loaded: false,
  load: async () => {
    const mgr = ProxyManager.sharedManager();
    const settings = await mgr.getNginxSettings();
    set({ settings, loaded: true });
  },
  updateSettings: async (settings: INginxSettings) => {
    const mgr = ProxyManager.sharedManager();
    await mgr.saveNginxSettings(settings);
    set({ settings });
    toast.success("Nginx settings saved", {
      description: "Restart the container to apply changes.",
    });
  },
  resetToDefaults: async () => {
    const mgr = ProxyManager.sharedManager();
    await mgr.saveNginxSettings(DEFAULT_NGINX_SETTINGS);
    set({ settings: DEFAULT_NGINX_SETTINGS });
    toast.success("Nginx settings reset to defaults", {
      description: "Restart the container to apply changes.",
    });
  },
}));

export default nginxSettingsStore;

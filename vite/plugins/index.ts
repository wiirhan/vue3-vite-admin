import vue from "@vitejs/plugin-vue";

import createAutoImport from "./auto-import";
import createComponents from "./components";
import createCompression from "./compression";
import createSetupExtend from "./setup-extend";
import createSvgIcon from "./svg-icon";
import type { PluginOption } from "vite";

export default function createVitePlugins(
  viteEnv: Record<string, string>,
  isBuild = false,
) {
  const vitePlugins: PluginOption[] = [vue()];
  vitePlugins.push(
    createAutoImport(),
    createComponents(),
    createSetupExtend(),
    createSvgIcon(isBuild),
  );
  if (isBuild) {
    vitePlugins.push(...createCompression(viteEnv));
  }
  return vitePlugins;
}

import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default function createAutoImport() {
  return AutoImport({
    imports: ["vue", "@vueuse/core"],
    resolvers: [ElementPlusResolver()],
    dts: true,
    dirs: ["./src/composables"],
    vueTemplate: true,
  });
}

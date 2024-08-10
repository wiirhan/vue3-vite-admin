import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

export default function createComponents() {
  return Components({
    resolvers: [ElementPlusResolver()],
  })
}

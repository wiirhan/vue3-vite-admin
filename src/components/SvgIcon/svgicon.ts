import * as components from '@element-plus/icons-vue'
import type { App } from 'vue'

export default {
  install: (app: App<Element>) => {
    Object.entries(components).forEach(([, componentConfig]) => {
      app.component(componentConfig.name!, componentConfig)
    })
  },
}

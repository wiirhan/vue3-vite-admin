import { sxzz } from '@sxzz/eslint-config'

export default sxzz(
  [
    /* your custom config */
    {
      rules: {
        'unicorn/filename-case': [
          'error',
          {
            cases: {
              camelCase: true,
              pascalCase: true,
              kebabCase: true,
            },
          },
        ],
      },
    },
  ],
  // Features: it'll detect installed dependency and enable necessary features automatically
  {
    prettier: true,
    markdown: true,
    vue: true, // auto detection
    unocss: false, // auto detection
  },
)

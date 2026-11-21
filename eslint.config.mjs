import {defineConfig, globalIgnores} from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      '@next/next/no-assign-module-variable': 'off',
    },
  },
  globalIgnores(['.next/**', 'node_modules/**']),
])

import { defineConfig } from 'orval'

const createApiOutput = (service: 'monitoring', mutatorName: string) => ({
  target: `./src/services/generated/${service}/api.ts`,
  schemas: `./src/services/generated/${service}/models`,
  client: 'react-query' as const,
  httpClient: 'fetch' as const,
  mode: 'tags-split' as const,
  clean: true,
  indexFiles: true,
  tsconfig: './tsconfig.app.json',
  override: {
    mutator: {
      path: './src/lib/openapi-fetch.ts',
      name: mutatorName,
    },
    fetch: {
      includeHttpResponseReturnType: false,
    },
  },
})

const createContractOutput = (service: 'monitoring') => ({
  target: `./src/contracts/generated/${service}/contracts.ts`,
  client: 'zod' as const,
  mode: 'tags-split' as const,
  clean: true,
  indexFiles: true,
  tsconfig: './tsconfig.app.json',
  packageJson: './package.json',
})

export default defineConfig({
  monitoringEmployeeApi: {
    input: {
      target: './src/open-api/monitoring-employee/openapi.json',
    },
    output: createApiOutput('monitoring', 'monitoringApiFetch'),
  },
  monitoringEmployeeContracts: {
    input: {
      target: './src/open-api/monitoring-employee/openapi.json',
    },
    output: createContractOutput('monitoring'),
  },
})

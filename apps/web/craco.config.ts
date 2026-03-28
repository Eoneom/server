import path from 'path'

const repoRoot = path.resolve(__dirname, '../..')
const clientSrc = path.join(repoRoot, 'packages', 'api-client', 'src')
const serverCore = path.join(repoRoot, 'apps', 'server', 'src', 'core')

const webSrc = path.join(__dirname, 'src')

const jestHashAliases: Record<string, string> = {
  '^#helpers/(.*)$': `${webSrc}/helpers/$1`,
  '^#hook/(.*)$': `${webSrc}/hook/$1`,
  '^#auth/(.*)$': `${webSrc}/modules/auth/$1`,
  '^#building/(.*)$': `${webSrc}/modules/building/$1`,
  '^#city/(.*)$': `${webSrc}/modules/city/$1`,
  '^#cost/(.*)$': `${webSrc}/modules/cost/$1`,
  '^#communication/(.*)$': `${webSrc}/modules/communication/$1`,
  '^#map/(.*)$': `${webSrc}/modules/map/$1`,
  '^#movement/(.*)$': `${webSrc}/modules/movement/$1`,
  '^#outpost/(.*)$': `${webSrc}/modules/outpost/$1`,
  '^#requirement/(.*)$': `${webSrc}/modules/requirement/$1`,
  '^#store/(.*)$': `${webSrc}/store/$1`,
  '^#technology/(.*)$': `${webSrc}/modules/technology/$1`,
  '^#troop/(.*)$': `${webSrc}/modules/troop/$1`,
  '^#types$': `${webSrc}/types/index.ts`,
  '^#types/(.*)$': `${webSrc}/types/$1`,
  '^#ui/(.*)$': `${webSrc}/ui/$1`,
  '^@eoneom/api-client$': path.join(clientSrc, 'index.ts'),
  '^@server-core/(.*)$': `${serverCore}/$1`,
}

module.exports = {
  jest: {
    configure: (jestConfig: { moduleNameMapper?: Record<string, string | string[]> }) => ({
      ...jestConfig,
      moduleNameMapper: {
        ...jestConfig.moduleNameMapper,
        ...jestHashAliases,
      },
    }),
  },
  webpack: {
    configure: (webpackConfig: {
      module?: { rules?: Array<{ oneOf?: object[] }> }
      resolve?: {
        alias?: Record<string, string>
        modules?: string[]
        plugins?: Array<{ constructor?: { name?: string } }>
      }
    }) => {
      webpackConfig.resolve = webpackConfig.resolve ?? {}
      webpackConfig.resolve.plugins = (webpackConfig.resolve.plugins ?? []).filter(
        (plugin) => plugin.constructor?.name !== 'ModuleScopePlugin'
      )
      webpackConfig.resolve.modules = [
        path.join(__dirname, 'node_modules'),
        path.join(repoRoot, 'node_modules'),
        'node_modules',
      ]
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@eoneom/api-client': path.join(clientSrc, 'index.ts'),
        '@server-core': serverCore,
      }

      const oneOf = webpackConfig.module?.rules?.find((r) => r.oneOf)?.oneOf
      if (oneOf) {
        for (const rule of oneOf) {
          const r = rule as { include?: string | string[] }
          if (r.include) {
            r.include = Array.isArray(r.include)
              ? [ ...r.include, clientSrc, serverCore ]
              : [ r.include, clientSrc, serverCore ]
          }
        }
      }

      return webpackConfig
    },
    alias: {
      '#helpers': path.resolve(__dirname, 'src/helpers'),
      '#hook': path.resolve(__dirname, 'src/hook'),
      '#auth': path.resolve(__dirname, 'src/modules/auth'),
      '#building': path.resolve(__dirname, 'src/modules/building'),
      '#city': path.resolve(__dirname, 'src/modules/city'),
      '#cost': path.resolve(__dirname, 'src/modules/cost'),
      '#communication': path.resolve(__dirname, 'src/modules/communication'),
      '#map': path.resolve(__dirname, 'src/modules/map'),
      '#movement': path.resolve(__dirname, 'src/modules/movement'),
      '#outpost': path.resolve(__dirname, 'src/modules/outpost'),
      '#requirement': path.resolve(__dirname, 'src/modules/requirement'),
      '#store': path.resolve(__dirname, 'src/store'),
      '#technology': path.resolve(__dirname, 'src/modules/technology'),
      '#troop': path.resolve(__dirname, 'src/modules/troop'),
      '#types': path.resolve(__dirname, 'src/types'),
      '#ui': path.resolve(__dirname, 'src/ui'),
    },
  },
}

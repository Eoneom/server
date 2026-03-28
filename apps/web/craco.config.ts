import path from 'path'

const repoRoot = path.resolve(__dirname, '../..')
const clientSrc = path.join(repoRoot, 'client', 'src')
const serverCore = path.join(repoRoot, 'apps', 'server', 'src', 'core')

module.exports = {
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
        '@kroust/swarm-client': path.join(clientSrc, 'index.ts'),
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
      '#troup': path.resolve(__dirname, 'src/modules/troup'),
      '#types': path.resolve(__dirname, 'src/types'),
      '#ui': path.resolve(__dirname, 'src/ui'),
    },
  },
}

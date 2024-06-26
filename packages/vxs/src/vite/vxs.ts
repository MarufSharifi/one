import { dirname, resolve } from 'node:path'
import { version } from 'react'
import { type UserConfig, type InlineConfig, type PluginOption, loadConfigFromFile } from 'vite'
import { getOptimizeDeps, isWebEnvironment } from 'vxrn'
import { existsAsync } from '../utils/existsAsync'
import { clientTreeShakePlugin } from './clientTreeShakePlugin'
import { createFileSystemRouter } from './createFileSystemRouter'
import { loadEnv } from './loadEnv'
import type { VXSPluginOptions } from './types'
import { createVirtualEntry, virtualEntryId } from './virtualEntryPlugin'
import { vitePluginSsrCss } from './vitePluginSsrCss'

const userOptions = new WeakMap<any, VXSPluginOptions>()

export async function loadUserVXSOptions(command: 'serve') {
  const found = await loadConfigFromFile({
    mode: 'prod',
    command,
  })
  if (!found) {
    throw new Error(`No config found`)
  }
  const foundVxsConfig = getUserVXSOptions(found.config)
  if (!foundVxsConfig) {
    throw new Error(`No VXS plugin added to config`)
  }
  return foundVxsConfig
}

export function getUserVXSOptions(config: UserConfig) {
  const flatPlugins = [...(config.plugins || [])].flat(3)
  const userOptionsPlugin = flatPlugins.find((x) => x && x['name'] === 'vxs-user-options')
  return userOptions.get(userOptionsPlugin)
}

export function vxs(options: VXSPluginOptions = {}): PluginOption {
  void loadEnv(process.cwd())

  if (!version.startsWith('19.')) {
    console.error(`Must be on React 19, instead found`, version)
    console.error(
      ` vxs vendors React 18 and aliases to it for native environments.
 It uses your local React for web, where it requires React 19.`
    )
    process.exit(1)
  }

  // build is superset for now
  const { optimizeDeps } = getOptimizeDeps('build')
  const optimizeIds = optimizeDeps.include
  const optimizeIdRegex = new RegExp(
    // santize ids for regex
    // https://stackoverflow.com/questions/6300183/sanitize-string-of-regex-characters-before-regexp-build
    `${optimizeIds.map((id) => id.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&')).join('|')}`
  )

  // weird i know
  const userOptionsPlugin = {
    name: 'vxs-user-options',
  }

  userOptions.set(userOptionsPlugin, options)

  return [
    userOptionsPlugin,
    // not working to watch various things...
    // {
    //   name: 'watch-node-modules',
    //   configureServer(server) {
    //     const { watcher, moduleGraph } = server

    //     // Watch the specified include patterns using Vite's internal watcher
    //     const customWatcher = chokidar.watch(['node_modules/**/*.js'], {
    //       cwd: join(process.cwd(), '..', '..'),
    //       ignoreInitial: true,
    //     })

    //     customWatcher.on('all', (event, path) => {
    //       console.log('gotem', path)
    //       moduleGraph.invalidateAll()
    //     })

    //     watcher.on('close', () => customWatcher.close())
    //   },
    // },

    createVirtualEntry({
      ...options,
      root: 'app',
    }),

    // TODO only on native env
    {
      name: 'use-react-18 for native',
      enforce: 'pre',

      async config() {
        const sharedNativeConfig = {
          resolve: {
            alias: {
              react: import.meta.resolve('vxs/react-18'),
              'react-dom': import.meta.resolve('vxs/react-dom-18'),
            },
          },
        } satisfies InlineConfig

        return {
          environments: {
            ios: {
              ...sharedNativeConfig,
            },
            android: {
              ...sharedNativeConfig,
            },
          },
        }
      },
    },

    {
      name: 'optimize-deps-load-web-extensions',
      enforce: 'pre',

      async resolveId(id, importer = '') {
        if (!isWebEnvironment(this.environment!)) {
          return
        }

        // client or ssr
        // console.log('env', this.environment?.name)
        const shouldOptimize = optimizeIdRegex.test(importer)

        if (shouldOptimize) {
          const absolutePath = resolve(dirname(importer), id)
          const webPath = absolutePath.replace(/(.m?js)/, '') + '.web.js'
          if (webPath === id) return
          try {
            const directoryPath = absolutePath + '/index.web.js'
            if (await existsAsync(directoryPath)) {
              return directoryPath
            }
            if (await existsAsync(webPath)) {
              return webPath
            }
          } catch (err) {
            console.warn(`error probably fine`, err)
          }
        }
      },
    },

    createFileSystemRouter(options),
    clientTreeShakePlugin(),
    vitePluginSsrCss({
      entries: [virtualEntryId],
    }),
  ]
}

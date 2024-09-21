import type { VXSRouter } from 'vxs'

declare module 'vxs' {
  export namespace VXSRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/_sitemap` | `/ssr/basic`
      DynamicRoutes: never
      DynamicRouteTemplate: never
      IsTyped: true
    }
  }
}
import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import { DashboardModuleOptions } from '@mercurjs/types'
import path from 'path'
loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    // The database host inside Docker is the service name (e.g. "postgres"),
    // which is not "localhost". Medusa's utils/ModulesSdkUtils would otherwise
    // auto-force an SSL connection for any non-localhost host (see
    // getDefaultDriverOptions in @medusajs/utils), and the in-container
    // PostgreSQL server rejects it with "The server does not support SSL
    // connections". Disable SSL explicitly so we connect over plain TCP.
    databaseDriverOptions: {
      connection: { ssl: false },
    },
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      // @ts-expect-error: vendorCors is not defined in medusa config module
      vendorCors: process.env.VENDOR_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  featureFlags: {
    rbac: true,
    seller_registration: true
  },
  modules: [
    {
      resolve: "@medusajs/medusa/rbac",
    },
    {
      resolve: '@mercurjs/core/modules/admin-ui',
      options: {
        appDir: path.join(__dirname, '../../apps/admin'),
        path: '/dashboard',
        viteDevServerHost: process.env.ADMIN_VITE_HOST || 'localhost',
        viteDevServerPort: Number(process.env.ADMIN_VITE_PORT || 7000),
      } as DashboardModuleOptions
    },
    {
      resolve: '@mercurjs/core/modules/vendor-ui',
      options: {
        appDir: path.join(__dirname, '../../apps/vendor'),
        path: '/seller',
        viteDevServerHost: process.env.VENDOR_VITE_HOST || 'localhost',
        viteDevServerPort: Number(process.env.VENDOR_VITE_PORT || 7001),
      } as DashboardModuleOptions
    },
  ],
  plugins: [{
    resolve: "@mercurjs/core",
    options: {}
  }]
})

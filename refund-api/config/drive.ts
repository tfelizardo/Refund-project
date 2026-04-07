import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, services } from '@adonisjs/drive'
import fs from 'node:fs'

const storagePath = app.makePath('storage')
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true })
}
const uploadsPath = app.makePath('storage/uploads')
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
}

const driveConfig = defineConfig({
  default: env.get('DRIVE_DISK'),

  /**
   * The services object can be used to configure multiple file system
   * services each using the same or a different driver.
   */
  services: {
    fs: services.fs({
      location: storagePath,
      serveFiles: true,
      routeBasePath: '/storage',
      visibility: 'private',
    }),
  },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> { }
}

import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: 'sqlite3',
      connection: {
        filename: app.makePath('tmp/db.sqlite3'),
      },
      useNullAsDefault: true,
    },
  },
})

export default dbConfig

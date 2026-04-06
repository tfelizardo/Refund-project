import { defineConfig } from '@adonisjs/cors'

export default defineConfig({
  enabled: true,
  origin: '*', // LIBERA GERAL (pra teste)
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
  headers: true,
  exposeHeaders: [],
  credentials: false,
  maxAge: 90,
})

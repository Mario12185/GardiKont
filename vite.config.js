import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'GardiKont', short_name: 'GardiKont',
      description: 'Validation numÃ©rique du gardiennage',
      theme_color: '#0f172a', background_color: '#ffffff', display: 'standalone', start_url: '/',
      icons: [{src:'/pwa-192.png',sizes:'192x192',type:'image/png'},{src:'/pwa-512.png',sizes:'512x512',type:'image/png'}]
    }
  })],
  base: import.meta.env.PROD ? '/GardiKont/' : '/', // ðŸ” Change en '/' si tu dÃ©ploies Ã  la racine d'un domaine
})
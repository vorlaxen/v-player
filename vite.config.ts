import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
    base: '/',
    plugins: [
        react(),
    ],
    define: {
        __BUILD_DATE__: JSON.stringify(new Date().toISOString().split('T')[0].replace(/-/g, '.')),
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@/config': fileURLToPath(new URL('./src/config', import.meta.url)),
            '@/components': fileURLToPath(new URL('./src/components', import.meta.url)),
            '@/pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
            '@/hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
            '@/utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
            '@/types': fileURLToPath(new URL('./src/types', import.meta.url)),
            '@/assets': fileURLToPath(new URL('./src/assets', import.meta.url))
        },
    },
    server: {
        port: 3001,
        host: true,
        open: true,
        fs: {
            strict: false,
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    redux: ['@reduxjs/toolkit', 'react-redux'],
                    ui: ['lucide-react'],
                },
            },
        },
    },
    css: {

    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom'
        ],
    },
})
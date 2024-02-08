import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression2'
import { fileURLToPath, URL } from 'url'
import { lingui } from '@lingui/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		sourcemap: false,
		rollupOptions: {
			output: {
				manualChunks: {
					react: ['react', 'react-dom', 'react-router-dom'],
					vectormap: ['jquery', '@react-jvectormap/core', '@react-jvectormap/world'],
					tremor: ['@tremor/react', '@heroicons/react'],
					tailwindcss: ['@headlessui/react', '@headlessui/tailwindcss', 'tailwind-merge']
				}
			}
		}
	},
	plugins: [
		react({	babel: { plugins: ['macros'] } }),
		lingui(),
		splitVendorChunkPlugin(),
		visualizer({ template: 'treemap', brotliSize: true, gzipSize: true }),
		compression({ algorithm: 'gzip', exclude: [/\.(br)$ /, /\.(gz)$/] }),
		compression({ algorithm: 'brotliCompress', exclude: [/\.(br)$ /, /\.(gz)$/] })
	],
	resolve: {
		alias: [
			{ find: '@components', replacement: fileURLToPath(new URL('./src/components', import.meta.url)) },
			{ find: '@utils', replacement: fileURLToPath(new URL('./src/utils', import.meta.url)) },
			{ find: '@hooks', replacement: fileURLToPath(new URL('./src/hooks', import.meta.url)) },
			{ find: '@context', replacement: fileURLToPath(new URL('./src/context', import.meta.url)) },
			{ find: '@pages', replacement: fileURLToPath(new URL('./src/pages', import.meta.url)) },
		]
	},
	server: {
		// this ensures that the browser opens upon server start
		open: true,
		// this sets a default port to 3000
		port: 3000
	},
})

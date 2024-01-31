import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression2'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		sourcemap: false,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom']
				}
			}
		}
	},
	plugins: [react(), visualizer({ template: 'treemap', brotliSize: true, gzipSize: true }), splitVendorChunkPlugin(),
		compression({
			algorithm: 'gzip', exclude: [/\.(br)$ /, /\.(gz)$/]
		}),
		compression({
			algorithm: 'brotliCompress', exclude: [/\.(br)$ /, /\.(gz)$/]
		})
	],
	resolve: {
		alias: [
			{ find: '@components', replacement: fileURLToPath(new URL('./src/components', import.meta.url)) },
			{ find: '@utils', replacement: fileURLToPath(new URL('./src/utils', import.meta.url)) },
		]
	},
	server: {
		// this ensures that the browser opens upon server start
		open: true,
		// this sets a default port to 3000
		port: 3000
	},
})

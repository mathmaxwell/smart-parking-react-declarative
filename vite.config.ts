import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'react/jsx-runtime': path.resolve(
				__dirname,
				'./src/i18n/config/jsx-runtime'
			),
			'react/jsx-dev-runtime': path.resolve(
				__dirname,
				'./src/i18n/config/jsx-dev-runtime'
			),
		},
	},
})

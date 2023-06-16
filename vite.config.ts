/* eslint-env node */

import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';
import dts from 'vite-plugin-dts';

// const standAlonePlugins = [react(), svgr({ icon: true, typescript: true })];
const buildPlugins = [
    dts({
        insertTypesEntry: true,
    }),
    react(),
    svgr(),
];

// https://vitejs.dev/config/
export default defineConfig({
    plugins: buildPlugins,
    resolve: {
        alias: {
            react: path.resolve(__dirname, './node_modules/react'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@components': path.resolve(__dirname, './src/components'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@gTypes': path.resolve(__dirname, './src/types'),
            '@constants': path.resolve(__dirname, './src/constants'),
            '@helper': path.resolve(__dirname, './src/helper'),
            '@queryClients': path.resolve(__dirname, './src/queryClients'),
            '@server': path.resolve(__dirname, './src/server'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
            reporter: ['text', 'json', 'html', 'lcov'],
        },
    },
    server: {
        port: 4173,
        host: true,
    },
    build: {
        // manifest: true,
        // minify: true,
        // reportCompressedSize: true,
        lib: {
            entry: path.resolve(__dirname, './src/main.tsx'),
            fileName: (format) => `main.${format}.js`,
            name: 'finance-approvals',
            formats: ['es', 'umd'],
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'react',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
});

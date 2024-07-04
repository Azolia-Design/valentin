import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import swup from '@swup/astro';

import { defineConfig, squooshImageService } from 'astro/config';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';

// https://astro.build/config
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items = []) =>
    hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
    output: 'hybrid',
    devToolbar: {
        enabled: false
    },
    integrations: [
        react(),
        markdoc(),
        keystatic(),
        solid({ devtools: true }),
        swup({ globalInstance: true }),
        icon(),
        ...whenExternalScripts(() =>
            partytown({
                config: { forward: ['dataLayer.push'] },
            })
        ),
        compress({
            CSS: true,
            HTML: {
                'html-minifier-terser': {
                    removeAttributeQuotes: false,
                },
            },
            Image: false,
            JavaScript: true,
            SVG: false,
            Logger: 1,
        })
    ],
    image: {
        service: squooshImageService(),
        domains: ['cdn.pixabay.com'],
    },
    vite: {
        resolve: {
            alias: {
            '~': path.resolve(__dirname, './src'),
            },
        },
    }
});

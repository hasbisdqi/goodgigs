import { createInertiaApp } from '@inertiajs/react';
import './echo';
import { configureEcho } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'Goodgigs';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    strictMode: true,
    withApp(app) {
        return app;
    },
    progress: {
        color: '#4B5563',
    },
});

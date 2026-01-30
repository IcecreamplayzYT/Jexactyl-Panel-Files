const { blue, zinc, cyan } = require('tailwindcss/colors');

module.exports = {
    content: ['./resources/scripts/**/*.{js,ts,tsx}'],
    theme: {
        extend: {
            backgroundImage: {
                storeone:
                    "url('https://cdn.neodesigns.studio/icons/jexpanel/ilya-pavlov-OqtafYT5kTw-unsplash.jpg')",
                storetwo:
                    "url('https://cdn.neodesigns.studio/icons/jexpanel/scott-rodgerson-PSpf_XgOM5w-unsplash.jpg')",
                storethree:
                    "url('https://raw.githubusercontent.com/IcecreamplayzYT/verve-cdn/refs/heads/main/albert-stoynov-dyUp7WPu5q4-unsplash.jpg?token=GHSAT0AAAAAADQZ3HBQRGLV7MIYBOZRGH6A2K6SCVA')",
            },
            colors: {
                black: '#000',
                // "primary" and "neutral" are deprecated.
                primary: blue,
                neutral: zinc,

                // Use cyan / gray instead.
                gray: zinc,
                cyan: cyan,
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: (theme) => ({
                default: theme('colors.neutral.400', 'currentColor'),
            }),
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ],
};

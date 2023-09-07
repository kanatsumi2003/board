/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "locker-blue": "#00A3E0",
        "locker-green": "#9DC63F",
        "locker-red": "#F05252",
      },
      backgroundImage: {
        home: "url('@/assets/locker.jpg')",
        dashboard: "url('@/assets/dashboard.jpg')",
      },
    },
  },
};

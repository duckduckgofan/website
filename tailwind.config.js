/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        dashmove: {
          '0%': { 'stroke-dashoffset': '0' },
          '100%': { 'stroke-dashoffset': '20' }
        }
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        scan: 'scan 4s linear infinite',
        dashmove: 'dashmove 2s linear infinite'
      },
      backgroundImage: {
        'world-map': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgODAwIDQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNzkuNSAxMDIuNWMzNi41LTIwLjcgODkuMS0yMCAxMjEuOS0xMS4yIDI4LjEgNy41IDU0LjIgMjUuMiA4My44IDI0LjcgMjkuNi0uNCA1Ny45LTE4LjQgODYuNy0yMi40IDI4LjktNCA1OC42IDUuNiA4Ni43IDEyLjQgMjguMSA2LjggNTYuOCAxMy41IDg0LjQgOC40IDI3LjYtNS4xIDUzLjctMjIuMSA4Mi4zLTI0LjcgMjguNi0yLjYgNTguNyA5LjQgODMuOCAyNC43IDI1LjEgMTUuMyA0NS43IDM4LjQgNzAuOSA0OS4zIDI1LjIgMTAuOSA1NC45IDkuNCA3OC4xLTIuOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0xMjEuOSAxNjQuOGMzNi41LTIwLjcgODkuMS0yMCAxMjEuOS0xMS4yIDI4LjEgNy41IDU0LjIgMjUuMiA4My44IDI0LjcgMjkuNi0uNCA1Ny45LTE4LjQgODYuNy0yMi40IDI4LjktNCA1OC42IDUuNiA4Ni43IDEyLjQgMjguMSA2LjggNTYuOCAxMy41IDg0LjQgOC40IDI3LjYtNS4xIDUzLjctMjIuMSA4Mi4zLTI0LjcgMjguNi0yLjYgNTguNyA5LjQgODMuOCAyNC43IDI1LjEgMTUuMyA0NS43IDM4LjQgNzAuOSA0OS4zIDI1LjIgMTAuOSA1NC45IDkuNCA3OC4xLTIuOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0xNjQuMyAyMjcuMWMzNi41LTIwLjcgODkuMS0yMCAxMjEuOS0xMS4yIDI4LjEgNy41IDU0LjIgMjUuMiA4My44IDI0LjcgMjkuNi0uNCA1Ny45LTE4LjQgODYuNy0yMi40IDI4LjktNCA1OC42IDUuNiA4Ni43IDEyLjQgMjguMSA2LjggNTYuOCAxMy41IDg0LjQgOC40IDI3LjYtNS4xIDUzLjctMjIuMSA4Mi4zLTI0LjcgMjguNi0yLjYgNTguNyA5LjQgODMuOCAyNC43IDI1LjEgMTUuMyA0NS43IDM4LjQgNzAuOSA0OS4zIDI1LjIgMTAuOSA1NC45IDkuNCA3OC4xLTIuOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0yMDYuNyAyODkuNGMzNi41LTIwLjcgODkuMS0yMCAxMjEuOS0xMS4yIDI4LjEgNy41IDU0LjIgMjUuMiA4My44IDI0LjcgMjkuNi0uNCA1Ny45LTE4LjQgODYuNy0yMi40IDI4LjktNCA1OC42IDUuNiA4Ni43IDEyLjQgMjguMSA2LjggNTYuOCAxMy41IDg0LjQgOC40IDI3LjYtNS4xIDUzLjctMjIuMSA4Mi4zLTI0LjcgMjguNi0yLjYgNTguNyA5LjQgODMuOCAyNC43IDI1LjEgMTUuMyA0NS43IDM4LjQgNzAuOSA0OS4zIDI1LjIgMTAuOSA1NC45IDkuNCA3OC4xLTIuOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')"
      }
    },
  },
  plugins: [],
}

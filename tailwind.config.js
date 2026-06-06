/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        soil: "#6f5a44",
        oat: "#f7f1e8",
        moss: "#5b6b4d",
        leaf: "#7d9a63",
        clay: "#c9865f",
        ember: "#b95f35",
        ink: "#223127",
        mist: "#eef3eb"
      },
      fontFamily: {
        sans: [
          "\"Noto Sans SC\"",
          "\"PingFang SC\"",
          "\"Hiragino Sans GB\"",
          "\"Microsoft YaHei\"",
          "sans-serif"
        ],
        serif: [
          "\"Noto Serif SC\"",
          "\"Songti SC\"",
          "serif"
        ]
      },
      boxShadow: {
        card: "0 20px 50px rgba(34, 49, 39, 0.08)"
      },
      backgroundImage: {
        "grain-wash": "radial-gradient(circle at top left, rgba(255,255,255,0.65), transparent 35%), linear-gradient(135deg, rgba(247,241,232,0.96), rgba(238,243,235,0.9))",
        "earth-glow": "radial-gradient(circle at top, rgba(201,134,95,0.16), transparent 30%), radial-gradient(circle at 80% 20%, rgba(125,154,99,0.18), transparent 28%), linear-gradient(180deg, #f6f2ea 0%, #edf3ea 100%)"
      }
    }
  },
  plugins: []
};

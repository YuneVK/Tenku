export default {
  celestial: {
    projection: "airy",
    //projection: "equirectangular",
    form: true,
    width: window.innerWidth,
    center: [-65, 0],
    //center: [180, 90],
    background: { fill: "#160048", stroke: "#160048", opacity: 1, width: 1 },
    datapath: "./data/",
    adaptable: true,
    stars: {
      colors: true,
      names: false,
      style: { fill: "#FEFFFF", opacity: 1 },
      limit: 6,
      size: 5
    },
    dsos: { show: false },
    mw: {
      style: { fill: "#2C0089", opacity: 0.1 }
    },
    constellations: {
      show: false,
      linestyle: { stroke: "transparent", width: 0, opacity: 0 },
    },
    lines: {
      graticule: { show: true, stroke: "#cccccc", width: 0.6, opacity: 0.15 },
      equatorial: { show: true, stroke: "#cccccc", width: 0.6, opacity: 0.4 },
      ecliptic: { show: false }
    },
    location: true,
    planets: {  //Show planet locations, if date-time is set
      show: true,
      // List of all objects to show
      which: ["sol", "mer", "ven", "ter", "lun", "mar", "jup", "sat", "ura", "nep"],
      // Font styles for planetary symbols
      style: {
        fill: "#00ccff", font: "bold 22px 'Lucida Sans Unicode', Consolas, sans-serif",
        align: "center", baseline: "middle"
      },
      symbols: {  // Character and color for each symbol in 'which', simple circle \u25cf
        "sol": { symbol: "\u2609", fill: "#ffff00" },
        "mer": { symbol: "\u263f", fill: "#cccccc" },
        "ven": { symbol: "\u2640", fill: "#eeeecc" },
        "ter": { symbol: "\u2295", fill: "#00ffff" },
        "lun": { symbol: "\u25cf", fill: "#ffffff" }, // overridden by generated cresent
        "mar": { symbol: "\u2642", fill: "#ff9999" },
        "cer": { symbol: "\u26b3", fill: "#cccccc" },
        "ves": { symbol: "\u26b6", fill: "#cccccc" },
        "jup": { symbol: "\u2643", fill: "#ff9966" },
        "sat": { symbol: "\u2644", fill: "#ffcc66" },
        "ura": { symbol: "\u2645", fill: "#66ccff" },
        "nep": { symbol: "\u2646", fill: "#6666ff" },
        "plu": { symbol: "\u2647", fill: "#aaaaaa" },
        "eri": { symbol: "\u25cf", fill: "#eeeeee" }
      }
    }
  },

  lineStyle: {
    stroke: "#FEFFFF",
    opacity: ".5",
    fill: "transparent",
    width: 1
  },
  textStyle: {
    fill: "#fafafa",
    font: "bold 15px 'Open Sans', sans-serif",
    align: "center",
    baseline: "middle"
  }
}
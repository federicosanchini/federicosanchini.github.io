const projects = [
  {
    "id": "basket-lab",
    "files": [],
    "year": "2026",
    "title": "Interactive Options Pricing",
    "category": "Quant",
    "description": "Interactive Monte Carlo pricing of two-asset basket options, with Greeks, sensitivity charts and simulated price paths.",
    "tags": [
      "Monte Carlo",
      "Option Pricing",
      "Greeks",
      "JavaScript"
    ],
    "details": "Interactive application for analyzing European basket options, featuring dynamic parameter adjustments, price and confidence interval inspections, Greeks calculation, and risk-neutral or real-world Monte Carlo simulations.",
    "highlights": [
      "Configurable spots, strike, maturity, rates, volatilities and correlation.",
      "Monte Carlo pricing with confidence intervals and convergence analysis.",
      "Delta, gamma, vega, theta and rho using common random numbers.",
      "Sensitivity curves, spot–volatility heatmap and real-world scenario paths."
    ],
    "github": "https://github.com/federicosanchini/federicosanchini.github.io/tree/main/basket-lab",
    "demo": "/basket-lab/"
  },

  {
    id: "hyperliquid",
    files: [{"label": "Strategy report", "type": "pdf", "path": "assets/pdfs/hyperliquid_strategy_report.pdf"}],
    year: "2026",
    title: "Hyperliquid ML Trading Strategy",
    category: "Quant",
    description:
      "Market-neutral machine learning trading strategy on Hyperliquid perpetuals, with backtesting, PnL, drawdown and funding analysis.",
    tags: ["Python", "Machine Learning", "Trading", "Crypto"],
    details:
      "A quantitative-finance project exploring a market-neutral machine-learning strategy on Hyperliquid perpetual futures.",
    highlights: [
      "Market-neutral long/short strategy.",
      "Machine-learning trading signals.",
      "Backtesting with PnL and drawdown analysis.",
      "Funding-rate impact analysis."
    ],
    github: "https://github.com/federicosanchini/hyperliquid-ML-trading-strategy",
    demo: ""
  },

  {
    id: "black-scholes",
    files: [{"label": "Black-Scholes derivation", "type": "pdf", "path": "assets/pdfs/Black_Scholes.pdf"}],
    year: "2026",
    title: "Black-Scholes Equation",
    category: "Quant",
    description:
      "Derivation of the Black-Scholes equation using geometric Brownian motion, Ito calculus, delta hedging and no-arbitrage.",
    tags: ["Black-Scholes", "GBM", "Derivatives", "Quant Finance"],
    details:
      "A quantitative-finance project deriving the Black-Scholes PDE from stochastic asset-price dynamics.",
    highlights: [
      "Geometric Brownian motion.",
      "Ito's lemma.",
      "Delta-hedged portfolio.",
      "No-arbitrage derivation of the Black-Scholes PDE."
    ],
    github: "https://github.com/federicosanchini/Black-Scholes-equation",
    demo: ""
  },

  {
    id: "calcofi",
    files: [{"label": "CalCOFI notebook", "type": "notebook", "path": "assets/notebooks/CalCOFI.ipynb", "preview": "assets/previews/CalCOFI.html"}],
    year: "2026",
    title: "CalCOFI Oceanographic Machine Learning",
    category: "ML",
    description:
      "Prediction of ocean temperature and salinity using Ridge Regression, RBF kernels and Random Fourier Features.",
    tags: ["Python", "Machine Learning", "Ridge", "RBF"],
    details:
      "A machine-learning project based on CalCOFI oceanographic observations.",
    highlights: [
      "Oceanographic data analysis.",
      "Ridge Regression baseline.",
      "RBF kernel regression.",
      "Random Fourier Features."
    ],
    github: "https://github.com/federicosanchini/CalCOFI",
    demo: ""
  },

  {
    id: "chaotic-systems",
    files: [{"label": "Chaotic systems report", "type": "pdf", "path": "assets/pdfs/Chaotic System.pdf"}],
    year: "2026",
    title: "Chaotic Systems & Causal Inference",
    category: "Physics",
    description:
      "Causal analysis of coupled chaotic systems using Convergent Cross Mapping and nonlinear time-series methods.",
    tags: ["Chaos", "Causality", "CCM", "Physics"],
    details:
      "A computational-physics project studying causal relationships between coupled chaotic dynamical systems.",
    highlights: [
      "Chaotic dynamical systems.",
      "Convergent Cross Mapping.",
      "Nonlinear causal inference.",
      "Bidirectional coupling analysis."
    ],
    github: "https://github.com/federicosanchini/Chaotic-Systems-and-Causal-Inference",
    demo: ""
  },

  {
    id: "denmark-income",
    files: [{"label": "Denmark income notebook", "type": "notebook", "path": "assets/notebooks/denmark_income.ipynb", "preview": "assets/previews/denmark_income.html"}],
    year: "2026",
    title: "Denmark Income Analysis",
    category: "Data",
    description:
      "Statistical analysis and visualization of income distribution and inequality in Denmark.",
    tags: ["Python", "Statistics", "EDA", "Visualization"],
    details:
      "A data-analysis project examining income distribution and socioeconomic patterns in Denmark.",
    highlights: [
      "Exploratory data analysis.",
      "Income distribution visualization.",
      "Inequality metrics.",
      "Statistical interpretation."
    ],
    github: "https://github.com/federicosanchini/Denmark-income-analysis",
    demo: ""
  },

  {
    id: "kaya",
    files: [{"label": "Kaya report", "type": "pdf", "path": "assets/pdfs/Kaya Report.pdf"}],
    year: "2026",
    title: "Kaya Equation & Global Emissions",
    category: "Data",
    description:
      "Analysis of global CO2 emissions using population, GDP, energy intensity and carbon intensity.",
    tags: ["Python", "Climate Data", "Statistics", "Kaya Identity"],
    details:
      "A data-driven study of global CO2 emissions using the Kaya identity.",
    highlights: [
      "Cross-country emissions analysis.",
      "Kaya identity decomposition.",
      "Energy and carbon intensity.",
      "Global data visualization."
    ],
    github: "https://github.com/federicosanchini/Kaya-Equation",
    demo: ""
  },

  {
    id: "astar",
    files: [{"label": "A* notebook", "type": "notebook", "path": "assets/notebooks/A_star.ipynb", "preview": "assets/previews/A_star.html"}],
    year: "2026",
    title: "A* Pathfinding Algorithm",
    category: "Algorithms",
    description:
      "Interactive exploration of A* search and heuristic pathfinding.",
    tags: ["Python", "Algorithms", "A*", "Pathfinding"],
    details:
      "An interactive notebook exploring the A* pathfinding algorithm and heuristic search.",
    highlights: [
      "A* implementation.",
      "Heuristic functions.",
      "Grid pathfinding.",
      "Maze and circuit-map applications."
    ],
    github: "https://github.com/federicosanchini/A-Algorithm",
    demo: ""
  }
];

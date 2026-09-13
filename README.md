# cc-calculator-2026
Calculating the most suitable credit card in Malaysia for you in 2026 based on your spending habits

## Running it
Just open `index.html` in a browser. It's a static page — `dist/app.js` and
`dist/app.css` are pre-built, so no server or install step is required.

## Editing
The editable source is `src/app.jsx` (a React app) and `src/input.css`
(Tailwind entry point). After changing either, rebuild the static assets:

```
npm install   # first time only
npm run build
```

This regenerates `dist/app.js` (React + the app, bundled and minified with
esbuild) and `dist/app.css` (only the Tailwind utility classes the page
actually uses). Nothing is fetched from a CDN at runtime — the page works
fully offline.

## What's in the dashboard
- 47 Malaysian credit cards across 16 issuers, each with its own sourced
  points-to-miles conversion table (see the green/amber badges), sign-up
  bonus, fee waiver rule, lounge and insurance benefits.
- A scoring engine that ranks cards by your actual monthly spending, values
  points via the best redemption route available on that specific card, and
  flags issues (unsourced rates, wasted caps, stranded points below the
  minimum transfer block).
- A multi-year projection that prices in each programme's observed
  devaluation history, a wallet optimiser for holding more than one card, and
  a side-by-side comparison view.
- Dark mode (top-right toggle, persisted per browser) and a mobile layout
  (bottom tab bar) alongside the desktop side-rail layout.

All spending, income and fee-ceiling fields start at zero — nothing is
pre-filled, so the ranking only ever reflects numbers you actually entered.

## Beyond what's modelled
The Valuation tab lists what the scoring engine does not account for
(interest charges, quarterly spend tiers, points pooling, campaign transfer
bonuses). Worth checking manually before committing to a card for the long
run:
- Credit approval odds (CTOS/CCRIS score, existing exposure with the issuer)
- Cash advance fee and interest rate, and the late-payment penalty APR
- Supplementary card fees, and Shariah-compliant (Islamic) card options
- Card network acceptance (Visa/Mastercard vs Amex) where you'll actually use it
- Contactless/Apple Pay/Google Pay support, and BNPL/EPP conversion terms
- Whether the annual-fee waiver is genuinely permanent or needs annual review
- Impact on your credit utilisation ratio and score if you close a card later

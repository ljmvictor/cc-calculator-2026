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
- 48 Malaysian credit cards across 16 issuers, each with its own sourced
  points-to-miles conversion table (see the green/amber badges), sign-up
  bonus, fee waiver rule, lounge and insurance benefits.
- **Monthly vs annual spending.** Everyday categories are entered per month;
  flights, hotels and overseas retail are entered **per year**, because that
  spend arrives in lumps. The engine places the yearly travel figure inside a
  set number of trip months and prices every month separately, so a monthly
  cashback cap bites on a RM6,000 flight the way it really would.
- **Wallet perks counted once.** Lounge access and travel insurance are
  allocated across the whole wallet rather than added up per card — three
  lounge cards do not get you into the lounge three times.
- **Partner lounge.** On a 2- or 3-card wallet you can say a partner flies
  with you. The optimiser then picks a second lounge card *only when it has
  to*: if your main card carries a guest allowance or shares its passes with
  a supplementary cardholder, your partner walks in on your card for free and
  the card slot goes to rewards instead. The Lounge plan panel names which
  card to put in your partner's name.
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

## Data freshness
Card terms were last reviewed in **September 2026** against Malaysian
credit-card trade coverage — **not** read off issuer PDFs, which this project
cannot reach automatically. Conversion tables sourced to an issuer schedule
carry a green badge; everything else carries an amber one and should be
checked before you rely on it. Changes picked up in the September 2026 pass:

| Card | Change |
|---|---|
| UOB PRVI Miles Elite | Fee RM600, waiver RM50,000/yr from 1 Jan 2026; 12x in SG/TH/VN/ID |
| CIMB Travel World Elite | Waiver raised to RM120,000/yr (RM60,000 for 50%) |
| HSBC TravelOne | Now no annual fee; 6 passes shared with the supplementary card |
| Hong Leong Visa Infinite | Fee waived for life, but lounge cut to 4 visits, guests pay |
| UOB Visa Infinite Metal | Lounge capped at 12/yr (Jun 2026), supplementary access dropped (Mar 2026) |
| All UOB cards | One UOB card per lounge visit from 1 Sep 2026 |
| Maybank Grab Mastercard | Discontinued 7 Sep 2026, migrated to an 8%-cashback card capped at RM18/category |
| Maybank Amex Platinum Charge | Added — 5x on everything, ~0.71 miles/RM, RM3,250 fee with no waiver |
| Standard Chartered Journey | Fee RM600, waived year 1, then RM60,000/yr |

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

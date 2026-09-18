# Bursa Yield-on-Cost Lab

A standalone, single-file dashboard (`index.html`) that answers one question:
**if a stock's dividend keeps growing, does the yield measured against my
original purchase price eventually reach 100%, and do I get the capital gain
as well?**

Open `klci-yield/index.html` in any browser. No build step, no server, no
network calls — the simulation runs in the page.

## What it does

- Explains yield on cost (YoC) with a worked RM10.00 / 40 sen / 7.00% example.
- Simulates 100 Bursa Malaysia large caps, 300 Monte Carlo runs each, over 40
  years, and reports the median outcome per stock.
- Filter buttons for the **target yield on cost** (6% to 100%, plus a custom
  input), the **holding period** (10 to 40 years), **sector**, and a search box.
- A **DRIP toggle** that reinvests each dividend into more shares — the only
  realistic route to a 100% yield on cost inside one investing lifetime.
- A per-stock chart: median YoC path, the 10th–90th percentile band of runs,
  and your target line.

## The model

Each stock carries a long-run dividend profile rather than a price history:

| Field | Meaning |
| --- | --- |
| `y0` | entry dividend yield today, % |
| `g` | long-run DPS growth rate, % per year |
| `sd` | volatility of that growth, percentage points |
| `cut` | annual probability of a dividend cut |
| `dep` | average depth of a cut, as a fraction of DPS |
| `anc` | long-run "normal" market yield the price re-rates towards, % |

Each simulated year the dividend either suffers a cut or grows by
`g ± sd`; the market yield mean-reverts towards `anc` with noise; and the
share price falls out as `DPS ÷ market yield`. That last line is the point of
the whole exercise — dividend growth and capital gain are the same engine seen
from two ends.

The PRNG is seeded per stock and per path, so the same settings always produce
the same table.

## Data provenance — read this before trusting a number

The session that built this had **no network access to Bursa Malaysia, Yahoo
Finance or any price vendor**, so this is *not* a backtest on downloaded price
and dividend files. The per-stock parameters are hand-set to match how each
company and its sector have historically paid. Treat the output as a structural
map of Bursa's dividend landscape, and re-run it against real DPS histories
before putting money behind it.

Not investment advice.

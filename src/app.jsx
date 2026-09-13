import React, { useState, useMemo, useEffect } from "react";
import { createRoot } from "react-dom/client";

/* ============================================================================
   ICONS — small inline SVGs (lucide-style paths), no external icon package
   ========================================================================== */
function Icon({ children, size = 16, className = "", ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>
      {children}
    </svg>
  );
}
const Wallet = (p) => <Icon {...p}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></Icon>;
const SlidersHorizontal = (p) => <Icon {...p}><line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /><line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="16" x2="16" y1="18" y2="22" /></Icon>;
const Trophy = (p) => <Icon {...p}><path d="M8 21h8" /><path d="M12 17v4" /><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" /><path d="M17 5h2a2 2 0 0 1 0 4h-2" /><path d="M7 5H5a2 2 0 0 0 0 4h2" /></Icon>;
const Layers = (p) => <Icon {...p}><path d="m12.83 2.18-8.58 3.9a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83l-8.58-3.9a2 2 0 0 0-1.66 0Z" /><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" /></Icon>;
const Database = (p) => <Icon {...p}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" /></Icon>;
const Settings2 = (p) => <Icon {...p}><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></Icon>;
const TrendingDown = (p) => <Icon {...p}><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></Icon>;
const AlertTriangle = (p) => <Icon {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></Icon>;
const ChevronDown = (p) => <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>;
const ChevronRight = (p) => <Icon {...p}><path d="m9 18 6-6-6-6" /></Icon>;
const Search = (p) => <Icon {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>;
const X = (p) => <Icon {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icon>;
const Check = (p) => <Icon {...p}><path d="M20 6 9 17l-5-5" /></Icon>;
const ExternalLink = (p) => <Icon {...p}><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></Icon>;
const ShieldCheck = (p) => <Icon {...p}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></Icon>;
const Sun = (p) => <Icon {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></Icon>;
const Moon = (p) => <Icon {...p}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></Icon>;

/* ============================================================================
   MALAYSIAN CREDIT CARD OPTIMISER  —  v3
   ----------------------------------------------------------------------------
   Data model and scoring engine carried over unchanged from v2: each card
   carries its OWN conversion table (points per 1,000 miles, per airline, plus
   a cash-redemption rate) because Malaysian banks price conversions by CARD
   TIER, not by bank. Sign-up bonuses are modelled separately with a year-1
   toggle, and a multi-year cumulative curve prices in observed devaluation.

   The ONLY irreducible assumption left is what one airline mile is worth to
   you in ringgit — that depends on the cabin you redeem, so the Valuation tab
   lets you derive it from a real redemption instead of guessing.

   WHAT'S NEW IN v3 (merged in from the earlier "Optimizer Pro" build)
   1. Dark mode, toggleable, persisted in localStorage.
   2. Every spending / eligibility figure starts at 0 — nothing is pre-filled,
      so the ranking always reflects what YOU typed, never a stranger's guess.
   3. "Hide cards I can't get" starts OFF, since income starts at 0 and would
      otherwise hide the entire database on first load.
   4. Rebuilt as a single dependency-light file so it works as a plain static
      page on any device, instead of a fixed-width desktop layout.

   WHAT'S NEW IN v4 (September 2026)
   1. Flights, hotels and overseas retail are entered PER YEAR, not per month,
      and the engine places that spend inside `tripMonths` months of the year.
      Every month is then priced separately, so a monthly cashback cap bites on
      a RM6,000 flight the way it really does. See the CATS comment below.
   2. Lounge and travel insurance are allocated ONCE across a wallet instead of
      once per card — holding three lounge cards does not treble your access.
      A partner toggle then spends a card slot on a second lounge card only
      when your main card cannot already bring a guest.
   3. Card terms re-read off ISSUER PAGES in September 2026, replacing the
      trade-coverage figures the previous build carried. That pass contradicted
      a good deal of what was here. The larger corrections:

        - CIMB fees were wrong across the range. CIMB's own Product Disclosure
          Sheet waives the annual fee on Preferred Visa Infinite, World
          Mastercard and Cash Rebate Platinum (this file had RM600, RM480 and
          RM195), charges RM80 on the e Credit Card (this file had it free),
          and charges RM1,215.09 — not RM600 — on Travel World Elite, whose
          income bar is RM250,000, not RM150,000.
        - UOB Visa Infinite Metal was recorded as having had its lounge "cut to
          12 visits with supplementary access dropped". UOB's own page says the
          opposite: unlimited DragonPass access for the cardholder AND a guest,
          with supplementary cardholders keeping the same entitlement. That
          claim, and the matching devaluation events, have been removed.
        - UOB fees: EVOL is RM90, Lazada RM100, Lady's Solitaire RM300 and
          World RM600 — this file had RM195, RM195, RM800 and RM195.
        - Public Bank Visa Infinite is free for life and pays cash, not points;
          Visa Signature pays 2% capped at RM30, not 6% capped at RM38.
        - Hong Leong's Infinite card earns Enrich Points DIRECTLY, so it no
          longer routes through the Hong Leong points table.
        - RHB publishes three different miles ratios by card tier, so the single
          `rhb` conversion table was split into rhbPremier / rhbVI / rhbStd.
        - HSBC Live+ needs RM102,000 of income, not RM36,000.
        - Standard Chartered Simply Cash is not an uncapped 1.5% card.
        - AmBank has no "BonusLink Visa Infinite"; the card is a Signature.

   4. WHAT COULD NOT BE VERIFIED. Three issuer domains and all three fallback
      aggregators are unreachable from the environment this refresh ran in:
      maybank2u.com.my (403), aeoncredit.com.my, unirm.my (the UNIRinggit
      catalogue), ringgitplus.com, refinedpoints.com and bolehmiles.com.
      So all 8 Maybank cards, both AEON cards, and the UOB metal and privilege
      banking conversion ratios are CARRIED OVER UNCHECKED and are flagged as
      such in their notes. Anything still stamped `verified: "2026-05"` was not
      re-read in this pass. `sourced: true` now means exactly one thing: the
      ratio was read off the issuer page named in `src`.

   5. Cards removed or re-tiered: CIMB Petronas Visa Platinum (withdrawn from
      sale 28 Oct 2024, deactivated 30 Jun 2025) is replaced by the current
      PETRONAS Visa Platinum-i, and the PETRONAS Visa Infinite-i was added.
      AmBank BonusLink Visa Infinite became BonusLink Visa Signature. The
      PB-AIA card is a Visa Gold, not a Visa Platinum. MBSB Platinum Card-i was
      REMOVED — MBSB publishes only debit cards and no evidence of a credit
      card could be found; restore it if that is wrong.

   NOTE ON THE OLDER BUILD'S CARD LIST: its per-bank point formulas (UOB, CIMB,
   HSBC, SC, RHB) were hard-coded shortcuts, and this version keeps the issuer
   database as the single source of truth and drops those shortcuts. Its
   passcode lock screen was also dropped — a client-side password baked into
   the page's JavaScript is visible to anyone who views source, so it protected
   nothing and would have been misleading to keep.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   1. SPEND CATEGORIES
   ---------------------------------------------------------------------------
   `annual: true` means you enter a YEARLY figure, not a monthly one. Flights,
   hotels and overseas retail are lumpy — nobody spends RM500 a month on
   hotels, they spend RM6,000 over two trips. That distinction matters because
   monthly caps are assessed per statement: RM6,000 of flights in one month
   against an RM50 cashback cap wastes far more than RM500 a month would.
   Annual spend is therefore modelled as landing inside `tripMonths` months of
   the year, and the engine prices each month separately.
   ------------------------------------------------------------------------- */
const CATS = [
  { key: "groceries",   label: "Groceries",                   def: 0, fx: false },
  { key: "dining",      label: "Dining & cafes",              def: 0, fx: false },
  { key: "petrol",      label: "Petrol",                      def: 0, fx: false },
  { key: "onlineLocal", label: "Online shopping (MY)",        def: 0, fx: false },
  { key: "onlineOs",    label: "Online shopping (overseas)",  def: 0, fx: true  },
  { key: "ewallet",     label: "E-wallet reload",             def: 0, fx: false },
  { key: "utilities",   label: "Utilities & bills",           def: 0, fx: false },
  { key: "transport",   label: "e-Hailing, toll, parking",    def: 0, fx: false },
  { key: "entertain",   label: "Streaming & cinema",          def: 0, fx: false },
  { key: "insurance",   label: "Insurance premiums",          def: 0, fx: false },
  { key: "education",   label: "Education & government",      def: 0, fx: false },
  { key: "retail",      label: "Other retail",                def: 0, fx: false },
  { key: "travelAir",   label: "Flights & travel agents",     def: 0, fx: false, annual: true },
  { key: "hotel",       label: "Hotels",                      def: 0, fx: false, annual: true },
  { key: "overseasRet", label: "Overseas retail (in person)", def: 0, fx: true,  annual: true },
];
const MONTHLY_CATS = CATS.filter((c) => !c.annual);
const ANNUAL_CATS = CATS.filter((c) => c.annual);

/* When the card terms in this file were last reviewed, and how. Shown in the
   UI so a stale database is visible rather than silently trusted. */
const DATA_REVIEWED = "September 2026";
const DATA_NOTE = "Cards marked 2026-09 were re-read off the issuer's own website or fee schedule in September 2026, and each card's note says which figures came from there and which were carried over. Cards still marked 2026-05 were NOT re-checked: Maybank, AEON and the UNIRinggit rewards catalogue could not be reached during the refresh, so every Maybank and AEON figure is inherited from the previous build. Issuers change fees and caps without much notice, so confirm anything that decides your choice with the bank before you apply.";

/* ---------------------------------------------------------------------------
   2. FREQUENT FLYER PROGRAMMES
   `def` is a STARTING value in RM per mile, not a fact. Override it in the
   Valuation tab, ideally by working backwards from a redemption you'd
   actually make. Ranked roughly by scarcity: Enrich is the easiest to earn and
   the least valuable per mile; KrisFlyer and Asia Miles are harder and worth
   more, especially in premium cabins.
   ------------------------------------------------------------------------- */
const FFP = {
  enrich:    { name: "Enrich",        airline: "Malaysia Airlines",  def: 0.030 },
  krisflyer: { name: "KrisFlyer",     airline: "Singapore Airlines", def: 0.045 },
  asia:      { name: "Asia Miles",    airline: "Cathay Pacific",     def: 0.040 },
  avios:     { name: "Avios",         airline: "British Airways",    def: 0.040 },
  airasia:   { name: "airasia points",airline: "AirAsia",            def: 0.018 },
};

/* ---------------------------------------------------------------------------
   3. CONVERSION TABLES
   ---------------------------------------------------------------------------
   cashPer1  – points needed for RM1 of cash rebate / voucher value
   ffp       – points needed per 1,000 miles, by programme. null = not offered
   block     – minimum transfer block, in POINTS
   fee       – RM charged per transfer transaction
   expiry    – months the bank's points stay alive before conversion
   sourced   – true only where the ratio came off an issuer page
   ------------------------------------------------------------------------- */
const CONV = {
  cashOnly: {
    label: "Statement cash rebate", cashPer1: 1, ffp: {}, block: 0, fee: 0,
    expiry: 0, sourced: true, src: "Rebate posts directly to the statement", srcDate: "2026-09",
  },
  mbPremium: {
    label: "TreatsPoints — Visa Infinite / World Elite tier",
    cashPer1: 500,
    ffp: { enrich: 12500, krisflyer: 12500, asia: 12500, airasia: 7000 },
    block: 12500, fee: 0, expiry: 36, sourced: false, src: "", srcDate: "2026-09",
    note: "UNVERIFIED in the September 2026 refresh. maybank2u.com.my answers 403 Forbidden to this environment, including the TreatsPoints air-miles schedule this table used to cite, so the ratio could not be re-read off an issuer page. Figures below are the previous build's and may be stale.",
  },
  mbStandard: {
    label: "TreatsPoints — Classic / Gold / Platinum / Signature tier",
    cashPer1: 500,
    ffp: { enrich: 20000, krisflyer: 20000, asia: 20000, airasia: 7000 },
    block: 20000, fee: 0, expiry: 36, sourced: false, src: "", srcDate: "2026-09",
    note: "UNVERIFIED in the September 2026 refresh — see mbPremium. maybank2u.com.my is unreachable from here (403).",
  },
  mbCharge: {
    label: "TreatsPoints — American Express Platinum Charge tier",
    cashPer1: 500,
    ffp: { enrich: 7000, krisflyer: 7000, asia: 7000, airasia: 7000 },
    block: 7000, fee: 0, expiry: 36, sourced: false, src: "", srcDate: "2026-09",
    note: "UNVERIFIED. Back-solved from a trade-press miles-per-ringgit figure, never read off an issuer page, and Maybank's site is unreachable from here (403). Treat as a guess.",
  },
  cimb: {
    label: "CIMB Bonus Points",
    cashPer1: 500,
    ffp: { enrich: 12500, krisflyer: 15000, asia: 15000, avios: 15000, airasia: 15000 },
    block: 62500, fee: 0, expiry: 36, sourced: true,
    src: "https://www.cimb.com.my/en/personal/day-to-day-banking/cards/credit-card/bonus-points-redemption.html",
    srcDate: "2026-09",
    note: "Read off the issuer page: 500 BP = RM1, points expire three years after the end of the quarter they were earned in, and transfers go in multiples of 5,000 miles with a 5,000-mile minimum. The block here is that 5,000-mile floor priced in Enrich points (5,000 x 12.5); on KrisFlyer, Asia Miles or Avios the same floor costs 75,000 BP. The per-airline ratios themselves were NOT shown on that page and are carried over unverified.",
  },
  uobMetal: {
    label: "UNIRinggit — Visa Infinite Metal",
    cashPer1: 100, ffp: { enrich: 5000, krisflyer: 5000, asia: 5000, airasia: 5000 },
    block: 5000, fee: 0, expiry: 24, sourced: false, src: "", srcDate: "2026-09",
    note: "UNVERIFIED. The UNIRinggit catalogue at unirm.my — the source this table used to cite — is unreachable from this environment, so the metal-tier ratio could not be re-read.",
  },
  uobPBVI: {
    label: "UNIRinggit — Privilege Banking Visa Infinite",
    cashPer1: 100, ffp: { enrich: 10000, krisflyer: 10000, asia: 10000, airasia: 10000 },
    block: 10000, fee: 0, expiry: 24, sourced: false, src: "", srcDate: "2026-09",
    note: "UNVERIFIED — unirm.my is unreachable from this environment.",
  },
  uobStd: {
    label: "UNIRinggit — Visa Infinite / PRVI Miles Elite",
    cashPer1: 100, ffp: { enrich: 12000, krisflyer: 12000, asia: 12000, airasia: 12000 },
    block: 12000, fee: 0, expiry: 24, sourced: true,
    src: "https://www.uob.com.my/personal/cards/credit-cards/uob-prvi-miles-elite-card.page",
    srcDate: "2026-09",
    note: "UOB's own PRVI Miles Elite page states the Agoda earn rate is 'converted from UNIRM at 12,000 UNIRM = 1,000 miles', which fixes this ratio. Whether every airline partner shares it is not stated there.",
  },
  hsbc: {
    label: "HSBC Rewards Points", cashPer1: 500,
    ffp: { enrich: 25000, krisflyer: 30000, asia: 25000, avios: 25000, airasia: 25000 },
    block: 25000, fee: 0, expiry: 36, sourced: false, src: "", srcDate: "2026-09",
    note: "UNVERIFIED. HSBC Malaysia publishes its card pages but not an air-miles ratio table that could be reached from here; the figures below follow HSBC's regional schedule.",
  },
  sc:   { label: "SC 360° Rewards Points", cashPer1: 500,
          ffp: { enrich: 15000, krisflyer: 15000, asia: 15000, avios: 15000, airasia: 15000 },
          block: 15000, fee: 0, expiry: 36, sourced: false, src: "", srcDate: "2026-09",
          note: "UNVERIFIED — sc.com/my publishes card pages but no reachable 360° Rewards air-miles table. Note the Journey card converts at 2 SC Miles per AirMile, a separate scheme from these points." },

  /* RHB splits its ratio three ways by card tier — the old single `rhb` table could not
     express that, and understated the premium tiers. Read off RHB's own announcement. */
  rhbPremier: { label: "RHB Rewards — Premier Visa Infinite tier", cashPer1: 500,
          ffp: { enrich: 8000, krisflyer: 14000, asia: 14000, airasia: 14000 },
          block: 8000, fee: 0, expiry: 36, sourced: true,
          src: "https://www.rhbgroup.com/-/media/Assets/Corporate-Website/Document/Highlights/Announcement/H20230829-1.pdf",
          srcDate: "2026-09",
          note: "8,000 Loyalty Points = 1,000 Enrich; 14,000 = 1,000 KrisFlyer. Minimum redemption rose from 500 to 1,000 miles on 21 September 2023. Asia Miles and airasia are not on RHB's published table and are carried at the KrisFlyer rate as a placeholder." },
  rhbVI:  { label: "RHB Rewards — Visa Infinite tier", cashPer1: 500,
          ffp: { enrich: 10000, krisflyer: 14000, asia: 14000, airasia: 14000 },
          block: 10000, fee: 0, expiry: 36, sourced: true,
          src: "https://www.rhbgroup.com/-/media/Assets/Corporate-Website/Document/Highlights/Announcement/H20230829-1.pdf",
          srcDate: "2026-09",
          note: "10,000 Loyalty Points = 1,000 Enrich; 14,000 = 1,000 KrisFlyer." },
  rhbStd: { label: "RHB Rewards — all other RHB cards", cashPer1: 500,
          ffp: { enrich: 14000, krisflyer: 14000, asia: 14000, airasia: 14000 },
          block: 14000, fee: 0, expiry: 36, sourced: true,
          src: "https://www.rhbgroup.com/-/media/Assets/Corporate-Website/Document/Highlights/Announcement/H20230829-1.pdf",
          srcDate: "2026-09",
          note: "14,000 Loyalty Points = 1,000 Enrich or KrisFlyer on every non-Infinite RHB card." },
  hlb:  { label: "Hong Leong Reward Points", cashPer1: 500,
          ffp: { enrich: 10000, airasia: 12000 },
          block: 10000, fee: 0, expiry: 36, sourced: false, src: "", srcDate: "2026-09",
          note: "UNVERIFIED — Hong Leong publishes no reachable ratio table. Note the Infinite card no longer belongs here: it earns Enrich Points directly (see hlb-vi)." },
  pb:   { label: "Public Bank VIP Points", cashPer1: 500,
          ffp: { enrich: 20000, airasia: 20000 },
          block: 20000, fee: 0, expiry: 36, sourced: false, src: "", srcDate: "2026-09" },
  amb:  { label: "AmBank Rewards", cashPer1: 500,
          ffp: { enrich: 15000, airasia: 15000 },
          block: 15000, fee: 0, expiry: 36, sourced: false, src: "", srcDate: "2026-09" },
  alli: { label: "Alliance Timeless Points", cashPer1: 500,
          ffp: { enrich: 15000, airasia: 15000 },
          block: 15000, fee: 0, expiry: 0, sourced: false, src: "", srcDate: "2026-09" },
  ocbc: { label: "OCBC$ Rewards Points", cashPer1: 500,
          ffp: { enrich: 20000, airasia: 20000 },
          block: 20000, fee: 0, expiry: 60, sourced: false, src: "", srcDate: "2026-09",
          note: "Expiry corrected to 5 years — OCBC's Titanium page states OCBC$ are valid for five years and redeem as cash credit in the app. The air-miles ratios are UNVERIFIED; OCBC publishes no reachable conversion table." },
  affin:{ label: "Affin Reward Points", cashPer1: 500,
          ffp: { enrich: 20000, airasia: 20000 },
          block: 20000, fee: 0, expiry: 36, sourced: false, src: "", srcDate: "2026-09" },
  bonuslink: { label: "BonusLink Points", cashPer1: 200,
          ffp: { enrich: 12000, airasia: 12000 },
          block: 12000, fee: 0, expiry: 36, sourced: false, src: "", srcDate: "2026-09",
          note: "BonusLink also spends at face value in Petronas and partner stores, which is often the better route." },
  enrichDirect: { label: "Enrich Points earned directly", cashPer1: 0,
          ffp: { enrich: 1000 }, block: 1000, fee: 0, expiry: 36, sourced: true,
          src: "https://www.hlb.com.my/en/personal-banking/credit-cards/travel/infinite.html",
          srcDate: "2026-09",
          note: "No conversion step, so no block wastage and no transfer fee. Hong Leong's Infinite page states the card earns Enrich Points directly at RM1 = 1 point on dining, which is what fixes the 1:1 ratio here." },
  milesDirect: { label: "Airline miles earned directly", cashPer1: 0,
          ffp: { krisflyer: 1000, enrich: 1000, asia: 1000 }, block: 1000, fee: 0,
          expiry: 36, sourced: false, src: "", srcDate: "2026-09" },
  islam:{ label: "Bank Islam Points", cashPer1: 500, ffp: {}, block: 0, fee: 0,
          expiry: 36, sourced: false, src: "", srcDate: "2026-09" },
  aeon: { label: "AEON Point", cashPer1: 200, ffp: {}, block: 0, fee: 0,
          expiry: 24, sourced: false, src: "", srcDate: "2026-09" },
};

/* ---------------------------------------------------------------------------
   4. OBSERVED DEVALUATION HISTORY
   ------------------------------------------------------------------------- */
const DEVAL = {
  mbPremium:  { annual: 0.12, events: ["Feb 2025: 10,000 to 12,500 TP per 1,000 miles, a 25% rise"] },
  mbStandard: { annual: 0.14, events: ["Feb 2025: revision raised points needed by 25% to 43% across the range"] },
  mbCharge:   { annual: 0.12, events: ["Tracks the premium TreatsPoints tier, which rose 25% in Feb 2025"] },
  cimb:       { annual: 0.10, events: ["2024: minimum transfer block raised fivefold, from 15,000 to 75,000 BP"] },
  uobMetal:   { annual: 0.14, events: [] },
  uobPBVI:    { annual: 0.14, events: [] },
  uobStd:     { annual: 0.14, events: ["Sep 2024: UNIRM required per 1,000 miles rose 11% to 33%"] },
  rhbPremier: { annual: 0.10, events: ["Sep 2023: Enrich went from 3,000 to 8,000 Loyalty Points per 1,000 miles, and KrisFlyer from 6,000 to 14,000 — well over a doubling"] },
  rhbVI:      { annual: 0.10, events: ["Sep 2023: Enrich went from 4,000 to 10,000 Loyalty Points per 1,000 miles, KrisFlyer 6,000 to 14,000"] },
  rhbStd:     { annual: 0.10, events: ["Sep 2023: Enrich went from 5,500 to 14,000 Loyalty Points per 1,000 miles, KrisFlyer 6,000 to 14,000"] },
  hsbc:       { annual: 0.10, events: ["Jan 2025: KrisFlyer ratio moved from 25,000 to 30,000 points per 10,000 miles"] },
  amb:        { annual: 0.12, events: ["2025: Enrich Visa Infinite earn rates cut"] },
  alli:       { annual: 0.12, events: ["2025: Visa Platinum devalued"] },
  cashOnly:   { annual: 0.03, events: ["Cashback caps drift down but rebate is not subject to award-chart inflation"] },
  _default:   { annual: 0.08, events: [] },
};
const devalFor = (k) => DEVAL[k] || DEVAL._default;

/* ---------------------------------------------------------------------------
   5. CARD DATABASE
   ------------------------------------------------------------------------- */
const EX = ["ewallet", "utilities", "insurance", "education"];
const NOSIGN = { value: 0, minSpend: 0, window: 60, desc: "" };

const CARDS = [
  { id: "mb-2gold", bank: "Maybank", name: "2 Cards Gold (Amex + Visa)", net: "Amex / Visa",
    conv: "mbStandard", fee: 0, waiver: { t: "lifetime" }, income: 30000,
    base: { u: "pts", rate: 1 },
    rules: [{ cats: ["*"], u: "cb", rate: 5, cap: 50, wknd: true, label: "5% weekend cashback on the Amex face" }],
    capTotal: 50, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-05",
    signup: { value: 100, minSpend: 500, window: 60, desc: "Cashback on first spend" },
    note: "MAYBANK UNVERIFIED: maybank2u.com.my answers 403 Forbidden to this environment, so no figure on this card could be re-read off an issuer page in the September 2026 refresh. Everything here is carried over from the previous build. Weekend rebate sits on the Amex card only, and Amex acceptance is patchy." },

  { id: "mb-2plat", bank: "Maybank", name: "2 Cards Platinum (Amex + Visa)", net: "Amex / Visa",
    conv: "mbStandard", fee: 0, waiver: { t: "lifetime" }, income: 60000,
    base: { u: "pts", rate: 1 },
    rules: [
      { cats: ["*"], u: "cb", rate: 5, cap: 50, wknd: true, label: "5% weekend cashback on the Amex face" },
      { cats: ["*"], u: "pts", rate: 5, cap: 5000, wknd: true, label: "5x TreatsPoints on weekends" },
    ],
    capTotal: 50, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-05", signup: NOSIGN, note: "MAYBANK UNVERIFIED: maybank2u.com.my answers 403 Forbidden to this environment, so no figure on this card could be re-read off an issuer page in the September 2026 refresh. Everything here is carried over from the previous build. " },

  { id: "mb-vi", bank: "Maybank", name: "Visa Infinite", net: "Visa Infinite",
    conv: "mbPremium", fee: 800, waiver: { t: "spend", v: 30000 }, income: 150000,
    base: { u: "pts", rate: 1 },
    rules: [{ cats: ["onlineOs", "overseasRet", "travelAir", "hotel"], u: "pts", rate: 5, label: "5x on overseas and travel" }],
    capTotal: null, fx: 1.00, lounge: { p: "Plaza Premium", v: 12, g: 0 }, ins: 1000000,
    excl: EX, verified: "2026-05", signup: NOSIGN,
    note: "MAYBANK UNVERIFIED: maybank2u.com.my answers 403 Forbidden to this environment, so no figure on this card could be re-read off an issuer page in the September 2026 refresh. Everything here is carried over from the previous build. Earn rises to up to 10x TreatsPoints from 1 June 2026 per Maybank's card listing." },

  { id: "mb-worldelite", bank: "Maybank", name: "World Elite Mastercard", net: "World Elite MC",
    conv: "mbPremium", fee: 800, waiver: { t: "spend", v: 30000 }, income: 100000,
    base: { u: "pts", rate: 1 },
    rules: [{ cats: ["dining", "onlineOs", "overseasRet", "travelAir"], u: "pts", rate: 5, label: "5x dining, overseas and travel" }],
    capTotal: null, fx: 1.00, lounge: { p: "Plaza Premium", v: 6, g: 0 }, ins: 500000,
    excl: EX, verified: "2026-05", signup: NOSIGN,
    note: "MAYBANK UNVERIFIED: maybank2u.com.my answers 403 Forbidden to this environment, so no figure on this card could be re-read off an issuer page in the September 2026 refresh. Everything here is carried over from the previous build. Low miles yield, but the flexible conversion makes it useful for topping up a business-class redemption." },

  { id: "mb-charge", bank: "Maybank", name: "American Express Platinum Charge", net: "Amex Charge",
    conv: "mbCharge", fee: 3250, waiver: { t: "none" }, income: 200000,
    base: { u: "pts", rate: 5 },
    rules: [],
    capTotal: null, fx: 1.00, lounge: { p: "Plaza Premium", v: 12, g: 1, sup: true }, ins: 1500000,
    excl: EX, verified: "2026-05", signup: NOSIGN,
    note: "MAYBANK UNVERIFIED: maybank2u.com.my answers 403 Forbidden to this environment, so no figure on this card could be re-read off an issuer page in the September 2026 refresh. Everything here is carried over from the previous build. 5x TreatsPoints on everything, which trade sites rate at about 0.71 miles per ringgit — the strongest all-rounder in Malaysia for 2026. The RM3,250 fee has no published waiver, so it only pays at high spend. Amex acceptance is the practical limit." },

  { id: "mb-petrolgroc", bank: "Maybank", name: "Islamic Ikhwan Visa Platinum Card-i", net: "Visa Platinum",
    conv: "cashOnly", fee: 0, waiver: { t: "lifetime" }, income: 70000,
    base: { u: "cb", rate: 0.25 },
    rules: [{ cats: ["petrol", "groceries"], u: "cb", rate: 5, cap: 88, label: "5% petrol and groceries daily" }],
    capTotal: 88, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-05", signup: NOSIGN,
    note: "MAYBANK UNVERIFIED: maybank2u.com.my answers 403 Forbidden to this environment, so no figure on this card could be re-read off an issuer page in the September 2026 refresh. Everything here is carried over from the previous build. Maybank lists a RM88 monthly cap on the 5% petrol and groceries rebate." },

  { id: "mb-fnf", bank: "Maybank", name: "Family & Friends Card", net: "Visa Platinum",
    conv: "cashOnly", fee: 0, waiver: { t: "lifetime" }, income: 30000,
    base: { u: "cb", rate: 0.25 },
    rules: [{ cats: ["groceries", "petrol", "transport", "entertain"], u: "cb", rate: 5, cap: 50, min: 1500, label: "5% on four chosen lifestyle categories" }],
    capTotal: 50, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-05", signup: NOSIGN, note: "MAYBANK UNVERIFIED: maybank2u.com.my answers 403 Forbidden to this environment, so no figure on this card could be re-read off an issuer page in the September 2026 refresh. Everything here is carried over from the previous build. " },

  { id: "mb-grab-successor", bank: "Maybank", name: "Grab Mastercard replacement card", net: "Platinum MC",
    conv: "cashOnly", fee: 0, waiver: { t: "lifetime" }, income: 24000,
    base: { u: "cb", rate: 0.25 },
    rules: [{ cats: ["dining", "entertain", "onlineLocal"], u: "cb", rate: 8, cap: 54, min: 1500, label: "8% dining, digital lifestyle and online entertainment" }],
    capTotal: 54, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-05", signup: NOSIGN,
    note: "MAYBANK UNVERIFIED: maybank2u.com.my answers 403 Forbidden to this environment, so no figure on this card could be re-read off an issuer page in the September 2026 refresh. Everything here is carried over from the previous build. The Grab Mastercard Platinum was discontinued on 7 September 2026 and existing holders were migrated automatically. GrabCoin earning is gone; the replacement pays 8% on three categories, but only above RM1,500 total monthly spend and capped at RM18 a category — so RM54 a month at best." },

  { id: "cimb-cashrebate", bank: "CIMB", name: "Cash Rebate Platinum", net: "Visa/MC Platinum",
    conv: "cashOnly", fee: 0, waiver: { t: "lifetime" }, income: 24000,
    base: { u: "cb", rate: 0.20 },
    rules: [
      { cats: ["groceries", "petrol", "entertain", "utilities"], u: "cb", rate: 5, cap: 30, label: "Up to 5% on groceries, petrol, cinema, mobile and utility bills" },
    ],
    capTotal: 60, fx: 1.00, lounge: null, ins: 0, excl: ["insurance", "education"], verified: "2026-09", signup: NOSIGN,
    note: "Fee corrected to waived-for-life and income to RM24,000 from CIMB's Product Disclosure Sheet and card page; the database previously had RM195 with a 12-swipe waiver. The weekend-only structure it recorded is not what CIMB publishes — the bonus rate covers groceries, petrol, cinema, mobile and utilities. CIMB does not publish the per-category cap, so RM30 is carried over unverified." },

  { id: "cimb-e", bank: "CIMB", name: "e Credit Card", net: "Visa Platinum",
    conv: "cimb", fee: 80, waiver: { t: "none" }, income: 24000,
    base: { u: "cb", rate: 0.20 },
    rules: [{ cats: ["onlineLocal", "onlineOs", "ewallet", "transport"], u: "cb", rate: 8, cap: 50, min: 500, label: "8% online, e-wallet and contactless" }],
    capTotal: 50, fx: 1.00, lounge: null, ins: 0, excl: ["utilities", "insurance", "education"], verified: "2026-09",
    signup: NOSIGN,
    note: "Fee corrected to RM80 from CIMB's Product Disclosure Sheet — it is the one CIMB consumer card that is not fee-waived, and the database had it as free for life. Reaches roughly 0.96 miles per ringgit to Enrich, but only on e-Day, the 28th of each month, capped near RM1,667." },

  { id: "cimb-petronas", bank: "CIMB", name: "PETRONAS Visa Platinum-i", net: "Visa Platinum",
    conv: "cashOnly", fee: 0, waiver: { t: "lifetime" }, income: 24000,
    base: { u: "cb", rate: 0.20 },
    rules: [
      { cats: ["petrol"], u: "cb", rate: 8, cap: 100, label: "Up to 8% at PETRONAS, Setel and PETRONAS EV charging" },
      { cats: ["groceries", "dining", "transport"], u: "cb", rate: 2, cap: 100, label: "Up to 2% on groceries, dining and cashless parking" },
    ],
    capTotal: 100, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Replaces the CIMB Petronas Visa Platinum this database listed: CIMB withdrew that card from sale on 28 October 2024 and deactivated it on 30 June 2025. Rebate is capped at RM1,200 a year, modelled here as RM100 a month. From 1 January 2026 CIMB Islamic's cards moved from the Ujrah to the Tawarruq structure." },

  { id: "cimb-petronas-vi", bank: "CIMB", name: "PETRONAS Visa Infinite-i", net: "Visa Infinite",
    conv: "cashOnly", fee: 0, waiver: { t: "lifetime" }, income: 120000,
    base: { u: "cb", rate: 0.20 },
    rules: [
      { cats: ["petrol"], u: "cb", rate: 12, cap: 120, label: "Up to 12% at PETRONAS, Setel and PETRONAS EV charging" },
      { cats: ["groceries", "dining", "transport"], u: "cb", rate: 6, cap: 120, label: "Up to 6% on groceries, dining and cashless parking" },
      { cats: ["onlineOs", "overseasRet"], u: "cb", rate: 1, label: "1% unlimited on overseas spend" },
    ],
    capTotal: 120, fx: 1.00, lounge: { p: "Plaza Premium", v: 4, g: 0 }, ins: 300000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Added in the September 2026 refresh — the strongest published petrol rebate in the market. Fee waived for life, income RM120,000 (RM60,000 for CIMB@Work customers). Rebate capped at RM1,440 a year, modelled as RM120 a month; the 1% overseas rate needs a statement balance of RM1,500 or more. Also 12 Sky Lounge visits at Subang on RM2,000 of monthly spend. Travel takaful RM300,000." },

  { id: "cimb-travel", bank: "CIMB", name: "Travel World Elite Mastercard", net: "World Elite MC",
    conv: "cimb", fee: 1215, waiver: { t: "spend", v: 120000 }, income: 250000,
    base: { u: "pts", rate: 1 },
    rules: [
      { cats: ["travelAir", "hotel", "onlineOs", "overseasRet"], u: "pts", rate: 10, label: "10x on travel, airlines, duty-free and foreign currency" },
      { cats: ["groceries", "dining", "petrol", "retail", "onlineLocal", "transport", "entertain"], u: "pts", rate: 2, label: "2x on local spend" },
    ],
    capTotal: null, fx: 1.00, lounge: { p: "Plaza Premium First", v: 12, g: 0 }, ins: 1000000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Fee corrected to RM1,215.09 and income to RM250,000 from CIMB's Product Disclosure Sheet and card page — the database had RM600 and RM150,000. CIMB waives the 1% bank admin fee on foreign currency for this card, so the FX markup is the scheme rate alone. The 12 lounge visits are SHARED between the principal and supplementary cardholders. Waiver: RM120,000 a year for a full waiver or RM60,000 for half, both needing repayments from a CIMB account; new cardholders get a full first-year waiver at RM15,000 in 120 days." },

  { id: "cimb-preferred", bank: "CIMB", name: "Preferred Visa Infinite", net: "Visa Infinite",
    conv: "cimb", fee: 0, waiver: { t: "lifetime" }, income: 150000,
    base: { u: "pts", rate: 1 },
    rules: [{ cats: ["onlineOs", "overseasRet", "dining", "hotel"], u: "pts", rate: 10, label: "10x on dining and overseas" }],
    capTotal: null, fx: 2.25, lounge: { p: "Plaza Premium", v: 6, g: 0 }, ins: 1000000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Fee corrected to waived-for-life from CIMB's Product Disclosure Sheet; the database had RM600 with an RM40,000 waiver. About 0.92 miles per ringgit to Enrich at the higher spend tiers. Earn rates, lounge and insurance are not published on a reachable CIMB page and are carried over unverified." },

  { id: "cimb-world", bank: "CIMB", name: "World Mastercard", net: "World MC",
    conv: "cimb", fee: 0, waiver: { t: "lifetime" }, income: 100000,
    base: { u: "pts", rate: 1 },
    rules: [{ cats: ["dining", "onlineOs", "overseasRet"], u: "pts", rate: 5, label: "5x dining and overseas" }],
    capTotal: null, fx: 2.25, lounge: { p: "Plaza Premium", v: 4, g: 0 }, ins: 500000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Fee corrected to waived-for-life from CIMB's Product Disclosure Sheet; the database had RM480 with an RM30,000 waiver. Earn rates, lounge and insurance are carried over unverified." },

  { id: "pb-vsig", bank: "Public Bank", name: "Visa Signature", net: "Visa Signature",
    conv: "cashOnly", fee: 0, waiver: { t: "swipes", v: 12 }, income: 80000,
    base: { u: "cb", rate: 0.10 },
    rules: [{ cats: ["dining", "onlineLocal", "onlineOs"], u: "cb", rate: 2, cap: 30, label: "2% dining and online, minimum RM100 a transaction" }],
    capTotal: 30, fx: 1.00, lounge: { p: "Plaza Premium", v: 2, g: 0 }, ins: 500000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Corrected against Public Bank's card page: the first year is free and later years need 12 swipes, income is RM80,000, and the headline rate is 2% on dining and online capped at RM30 a cycle — not the 6% / RM38 this database recorded. Each transaction must be RM100 or more to qualify. The two lounge visits each need RM1,000 of retail spend within 30 days either side of the visit." },

  { id: "pb-quantum", bank: "Public Bank", name: "Quantum Visa / Mastercard", net: "Visa/MC",
    conv: "cashOnly", fee: 0, waiver: { t: "lifetime" }, income: 36000,
    base: { u: "cb", rate: 0.10 },
    rules: [{ cats: ["onlineOs", "overseasRet"], u: "cb", rate: 2, cap: 20, label: "2% overseas on the Mastercard, minimum RM100 a transaction" }],
    capTotal: 20, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Corrected against Public Bank's card page: free for life, income RM36,000, and the cap is RM20 a cycle across principal and supplementary cards combined. The Mastercard face pays 2% on overseas spend; the Visa face pays 1% on contactless. Every qualifying transaction must be RM100 or more." },

  { id: "pb-vi", bank: "Public Bank", name: "Visa Infinite", net: "Visa Infinite",
    conv: "cashOnly", fee: 0, waiver: { t: "lifetime" }, income: 100000,
    base: { u: "cb", rate: 0.30 },
    rules: [{ cats: ["onlineOs", "overseasRet"], u: "cb", rate: 1, label: "1% unlimited on overseas retail" }],
    capTotal: null, fx: 1.00, lounge: { p: "Plaza Premium", v: 5, g: 0 }, ins: 500000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Corrected against Public Bank's card page: free for life for the principal and first supplementary cardholder, income RM100,000. It is a Cash MegaBonus card, not a points card — 1% uncapped overseas and 0.3% uncapped locally — so the conversion table was switched from VIP Points to cash rebate. Lounge is 5 visits, each needing RM1,000 of retail spend within 30 days either side. Travel insurance RM500,000, not RM1,000,000." },

  { id: "pb-aia", bank: "Public Bank", name: "PB-AIA Visa Gold", net: "Visa Gold",
    conv: "pb", fee: 0, waiver: { t: "swipes", v: 12 }, income: 24000,
    base: { u: "pts", rate: 1 },
    rules: [{ cats: ["insurance"], u: "pts", rate: 3, label: "3x on AIA premiums" }],
    capTotal: null, fx: 1.00, lounge: null, ins: 0, excl: ["utilities", "education"], verified: "2026-09",
    signup: NOSIGN,
    note: "Renamed and re-tiered: Public Bank's AIA co-brand is a Visa GOLD card at RM24,000 income, not the Visa Platinum at RM60,000 this database listed. One of the few cards that earns on insurance premiums. The 3x rate is not published on a reachable page and is carried over unverified." },

  { id: "rhb-shell", bank: "RHB", name: "Shell Visa", net: "Visa Platinum",
    conv: "cashOnly", fee: 195, waiver: { t: "swipes", v: 24 }, income: 24000,
    base: { u: "cb", rate: 0.20 },
    rules: [
      { cats: ["petrol"], u: "cb", rate: 12, cap: 30, min: 250, label: "Up to 12% at Shell" },
      { cats: ["onlineOs", "overseasRet"], u: "cb", rate: 5, cap: 50, label: "Up to 5% on overseas spend" },
      { cats: ["groceries"], u: "cb", rate: 5, cap: 10, min: 500, label: "Up to 5% on groceries" },
      { cats: ["utilities"], u: "cb", rate: 5, cap: 10, min: 500, label: "Up to 5% on utilities" },
      { cats: ["ewallet", "onlineLocal"], u: "cb", rate: 5, cap: 10, min: 250, label: "Up to 5% on e-wallet and online" },
    ],
    capTotal: 110, fx: 1.00, lounge: null, ins: 0, excl: ["insurance", "education"], verified: "2026-09",
    signup: { value: 50, minSpend: 300, window: 60, desc: "Welcome cashback on first spend" },
    note: "Rebuilt from RHB's card page. It is NOT free for life: RM195 a year after a free first year, waived on 24 swipes — twice the usual requirement. The rebate is per-category, not a single pooled cap: 12% at Shell capped RM30, 5% overseas capped RM50, and 5% each on groceries, utilities and e-wallet/online capped RM10 apiece, with per-category minimums of RM500 (groceries, utilities) and RM250 (petrol, e-wallet). Unusually, e-wallet reloads and utilities are inside the bonus list." },

  { id: "rhb-rewards", bank: "RHB", name: "Rewards Credit Card", net: "Visa Signature",
    conv: "rhbStd", fee: 200, waiver: { t: "spend", v: 10000 }, income: 24000,
    base: { u: "pts", rate: 1 },
    rules: [
      { cats: ["entertain"], u: "pts", rate: 10, label: "10x on cinema" },
      { cats: ["onlineOs", "overseasRet"], u: "pts", rate: 4, label: "4x on overseas spend" },
      { cats: ["onlineLocal", "travelAir", "hotel"], u: "pts", rate: 3, label: "3x on online, airlines, hotels and travel" },
      { cats: ["insurance", "retail"], u: "pts", rate: 2, label: "2x on health, insurance and shopping" },
    ],
    capTotal: null, fx: 1.00, lounge: null, ins: 0, excl: ["utilities", "education"], verified: "2026-09",
    signup: { value: 50, minSpend: 500, window: 60, desc: "5,000 welcome Reward Points" },
    note: "Corrected against RHB's card page: fee RM200 after a free first year, waived at RM10,000 of annual spend, and income is RM24,000 not RM60,000. The full published rate card is 10x cinema, 4x overseas, 3x online and travel, 2x health/insurance/shopping, 1x everything else." },

  { id: "rhb-vi", bank: "RHB", name: "Visa Infinite", net: "Visa Infinite",
    conv: "rhbVI", fee: 600, waiver: { t: "spend", v: 36000 }, income: 150000,
    base: { u: "pts", rate: 1 },
    rules: [
      { cats: ["onlineOs", "overseasRet"], u: "pts", rate: 5, label: "5x on overseas spend" },
      { cats: ["travelAir", "hotel"], u: "pts", rate: 1, label: "1x on airlines, hotels and travel" },
    ],
    capTotal: null, fx: 1.00, lounge: { p: "Plaza Premium", v: 9, g: 0 }, ins: 2000000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Conversion moved to the Visa Infinite tier — RHB's own announcement puts this card at 10,000 Loyalty Points per 1,000 Enrich miles, better than the 14,000 every other RHB card pays. Lounge is tiered, not flat: 3 visits on activation, then 1 more for each calendar month you spend RM1,000, to a maximum of 9 a year, becoming unlimited only above RM100,000 of annual spend. Modelled at the realistic 9. Travel insurance RM2,000,000. Airlines and travel earn only 1x, not 5x." },

  { id: "rhb-premier-vi", bank: "RHB", name: "Premier Visa Infinite", net: "Visa Infinite",
    conv: "rhbPremier", fee: 800, waiver: { t: "lifetime" }, income: 250000,
    base: { u: "pts", rate: 1.5 },
    rules: [{ cats: ["onlineOs", "overseasRet", "travelAir", "hotel"], u: "pts", rate: 6, label: "6x overseas and travel" }],
    capTotal: null, fx: 1.00, lounge: { p: "Plaza Premium", v: 9, g: 0 }, ins: 1500000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "By invitation to RHB Premier customers. Best RHB conversion at 8,000 Loyalty Points per 1,000 Enrich miles. Same tiered lounge as the Visa Infinite: 3 on activation, +1 per RM1,000 month, capped at 9 unless you spend RM100,000 a year. Earn rates and insurance are not published on a reachable RHB page and are carried over unverified." },

  { id: "hlb-vi", bank: "Hong Leong", name: "Infinite Card", net: "Visa Infinite",
    conv: "enrichDirect", fee: 0, waiver: { t: "lifetime" }, income: 100000,
    base: { u: "pts", rate: 0.167 },
    rules: [
      { cats: ["dining"], u: "pts", rate: 1, label: "RM1 = 1 Enrich Point on dining, uncapped" },
      { cats: ["travelAir", "hotel", "retail", "onlineLocal", "onlineOs", "overseasRet"], u: "pts", rate: 0.25, label: "RM4 = 1 Enrich Point on travel and retail" },
    ],
    capTotal: null, fx: 1.00, lounge: { p: "Plaza Premium", v: 5, g: 0 }, ins: 2000000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Rebuilt from Hong Leong's own card page. This card earns ENRICH POINTS DIRECTLY, so it was moved off the Hong Leong Reward Points table onto the direct-Enrich one — no conversion block, no transfer fee. Published rates are RM1 = 1 point on dining (no monthly cap), RM4 = 1 on travel and retail shopping, RM6 = 1 on everything else. Free for life, income RM100,000 not RM150,000. Lounge is 4 a year plus 1 extra each card anniversary; guests are NOT free, they get about 20% off the published rate. Travel insurance RM2,000,000." },

  { id: "hlb-wise", bank: "Hong Leong", name: "WISE Card", net: "Visa Platinum",
    conv: "cashOnly", fee: 98, waiver: { t: "none" }, income: 24000,
    base: { u: "cb", rate: 0.20 },
    rules: [
      { cats: ["dining"], u: "cb", rate: 15, cap: 15, min: 1000, wknd: true, label: "15% on weekend dining" },
      { cats: ["groceries"], u: "cb", rate: 10, cap: 15, min: 1000, label: "10% on groceries, essentials and pharmacies" },
      { cats: ["petrol"], u: "cb", rate: 10, cap: 15, min: 1000, wknd: true, label: "10% on weekend petrol" },
      { cats: ["onlineLocal", "ewallet"], u: "cb", rate: 1, min: 1000, label: "1% on online and e-wallet" },
    ],
    capTotal: 45, fx: 1.00, lounge: null, ins: 0,
    excl: ["utilities", "insurance", "education"], verified: "2026-09", signup: NOSIGN,
    note: "Rebuilt from Hong Leong's card page. Fee is RM98 principal (RM48 supplementary) with NO waiver programme — this database had it free for life. Entry is RM24,000 of income or a RM2,000 fixed deposit. Bonus rates need RM1,000 of retail spend that month and are capped at RM15 a category: 15% weekend dining, 10% groceries and pharmacies, 10% weekend petrol, 1% online and e-wallet, 0.2% uncapped on everything else. Bill payments and in-app QR pay are excluded." },

  { id: "hlb-essential", bank: "Hong Leong", name: "Essential Credit Card", net: "MC",
    conv: "cashOnly", fee: 0, waiver: { t: "lifetime" }, income: 24000,
    base: { u: "cb", rate: 1.00 }, rules: [],
    capTotal: null, fx: 1.00, lounge: null, ins: 0, excl: [], verified: "2026-09", signup: NOSIGN,
    note: "Hong Leong publishes this as up to 1% UNLIMITED cashback, so the RM25 monthly ceiling this database applied has been removed. The rate is 1% on general retail and insurance and 0.5% on some categories including dining and government payments. Entry is RM24,000 of income or a RM2,000 fixed deposit; the first year's fee is waived under Hong Leong's fee-waiver programme, and the subsequent fee is not published on that page." },

  { id: "hlb-gsc", bank: "Hong Leong", name: "GSC Platinum", net: "Visa Platinum",
    conv: "cashOnly", fee: 0, waiver: { t: "swipes", v: 1 }, income: 24000,
    base: { u: "cb", rate: 0.25 },
    rules: [{ cats: ["entertain"], u: "cb", rate: 10, cap: 20, label: "10% cinema and entertainment" }],
    capTotal: 25, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Hong Leong waives the first year's fee on one swipe within 60 days of issuance. The card earns up to 3x GSC Reward Points on GSC, online, retail and overseas spend — a points scheme, not the flat cashback modelled here, which is carried over unverified because the rate card is not on a reachable page." },

  { id: "amb-cashrebate", bank: "AmBank", name: "Cash Rebate Visa Platinum", net: "Visa Platinum",
    conv: "cashOnly", fee: 0, waiver: { t: "lifetime" }, income: 24000,
    base: { u: "cb", rate: 0.20 },
    rules: [{ cats: ["petrol", "groceries"], u: "cb", rate: 5, cap: 30, min: 1500, label: "5% petrol and groceries" }],
    capTotal: 30, fx: 1.01, lounge: null, ins: 0, excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Free for life, confirmed in AmBank's fees and charges schedule effective 11 August 2026. Earn rates are not published on a reachable AmBank page and are carried over unverified." },

  { id: "amb-bonuslink-sig", bank: "AmBank", name: "BonusLink Visa Signature", net: "Visa Signature",
    conv: "bonuslink", fee: 550, waiver: { t: "swipes", v: 12 }, income: 80000,
    base: { u: "pts", rate: 0.167 },
    rules: [
      { cats: ["petrol", "retail"], u: "pts", rate: 5, cap: 3000, label: "5 BonusLink per RM1 at Shell and Parkson" },
      { cats: ["dining", "groceries", "onlineLocal", "onlineOs", "overseasRet"], u: "pts", rate: 2, label: "2 BonusLink per RM1 on dining, groceries, shopping and overseas" },
    ],
    capTotal: null, fx: 1.01, lounge: null, ins: 0, excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Retiered from 'BonusLink Visa Infinite', which does not exist — AmBank's fee schedule and product page list only Signature, Platinum and Gold. Fee RM550, waived for the first two years and then on 12 swipes a year; income RM80,000, not RM150,000. Shell and Parkson earn is capped at 3,000 points a cycle; everything else is 1 point per RM6. No lounge or travel insurance is published for this card. BonusLink spends at face value in Petronas and partner stores, which usually beats the airline route." },

  { id: "amb-enrich-vi", bank: "AmBank", name: "Enrich Visa Infinite", net: "Visa Infinite",
    conv: "enrichDirect", fee: 500, waiver: { t: "spend", v: 100000 }, income: 100000,
    base: { u: "pts", rate: 0.167 },
    rules: [
      { cats: ["onlineOs", "overseasRet", "travelAir"], u: "pts", rate: 0.50, label: "RM2 = 1 Enrich Point on overseas and Malaysia Airlines" },
      { cats: ["utilities", "insurance", "education"], u: "pts", rate: 0.083, cap: 8000, label: "RM12 = 1 Enrich Point on utilities, insurance and education" },
    ],
    capTotal: null, fx: 1.01, lounge: { p: "MAS Golden Lounge", v: 999, g: 1 }, ins: 2000000,
    excl: [], verified: "2026-09", signup: NOSIGN,
    note: "Rebuilt from AmBank's card page and fee schedule. Fee is RM500 not RM600; the waiver is tiered — 50% at RM50,000 of annual spend, 100% at RM100,000 — and the model uses the full-waiver threshold. Income RM100,000, not RM150,000. Published rates are RM2 = 1 point on overseas and Malaysia Airlines spend, RM6 = 1 locally, RM12 = 1 on education, insurance and utilities capped at 8,000 points a cycle. Lounge is UNLIMITED Malaysia Airlines Golden Lounge for the cardholder and one guest, not 6 Plaza Premium visits. Travel insurance RM2,000,000." },

  { id: "amb-signature", bank: "AmBank", name: "SIGNATURE Priority Banking Visa Infinite", net: "Visa Infinite",
    conv: "amb", fee: 800, waiver: { t: "lifetime" }, income: 250000,
    base: { u: "pts", rate: 2 },
    rules: [{ cats: ["onlineOs", "overseasRet", "travelAir", "hotel"], u: "pts", rate: 6, label: "6x overseas and travel" }],
    capTotal: null, fx: 1.01, lounge: { p: "Plaza Premium", v: 12, g: 1 }, ins: 1500000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Priority Banking relationship required. AmBank's published fee schedule lists an 'M-Signature' card at RM550 but no Signature Priority Banking Visa Infinite, so this card's fee, income, earn rates and perks could NOT be verified and are carried over from the previous build. FX markup is the one figure confirmed: AmBank adds 1% on top of the scheme rate." },

  { id: "alli-virtual", bank: "Alliance Bank", name: "Visa Virtual Card", net: "Visa Virtual",
    conv: "alli", fee: 0, waiver: { t: "lifetime" }, income: 36000,
    base: { u: "pts", rate: 1 },
    rules: [{ cats: ["ewallet", "onlineLocal", "insurance", "utilities"], u: "pts", rate: 8, cap: 24000, label: "Boosted rate on e-wallet and online, including insurance and utilities" }],
    capTotal: null, fx: 1.00, lounge: null, ins: 0, excl: [], verified: "2026-09", signup: NOSIGN,
    note: "Alliance's card listing confirms zero annual fee and RM24,000 minimum income for the virtual card; the earn rate and caps are not published there and are carried over unverified. About 0.53 Enrich miles per ringgit. Rare in earning on insurance, utilities and e-wallet." },

  { id: "alli-vi", bank: "Alliance Bank", name: "Visa Infinite", net: "Visa Infinite",
    conv: "cashOnly", fee: 438, waiver: { t: "spend", v: 40000 }, income: 60000,
    base: { u: "cb", rate: 1.00 },
    rules: [{ cats: ["onlineOs", "overseasRet"], u: "cb", rate: 2, label: "2% on foreign currency spend" }],
    capTotal: null, fx: 1.00, lounge: { p: "Plaza Premium", v: 6, g: 0 }, ins: 1000000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Fee corrected to RM438 and income to RM60,000 from Alliance's published card listing — the database had RM588 and RM150,000, which put this card out of reach of most people who actually qualify. Uncapped flat rebate, unusual in Malaysia. The waiver threshold, lounge and insurance are not published there and are carried over unverified." },

  { id: "alli-younique", bank: "Alliance Bank", name: "Visa Platinum", net: "Visa Platinum",
    conv: "cashOnly", fee: 120, waiver: { t: "lifetime" }, income: 24000,
    base: { u: "cb", rate: 0.30 },
    rules: [{ cats: ["*"], u: "cb", rate: 1.00, cap: 60, min: 3000, label: "Rebate rate you select, applied to all spend" }],
    capTotal: 60, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Alliance now lists this simply as the Visa Platinum Credit Card at RM120 a year with RM24,000 minimum income; the 'You:nique' branding and the fee-free entry this database recorded are gone. Alliance waives the first year and considers later waivers on request, so the lifetime flag is optimistic." },

  { id: "hsbc-live", bank: "HSBC", name: "Live+ Credit Card", net: "Visa Platinum",
    conv: "cashOnly", fee: 250, waiver: { t: "swipes", v: 12 }, income: 102000,
    base: { u: "cb", rate: 0.20 },
    rules: [
      { cats: ["dining", "retail", "entertain"], u: "cb", rate: 5, cap: 90, min: 5000, label: "5% dining, shopping and entertainment at RM5,000 a month" },
      { cats: ["dining", "retail", "entertain"], u: "cb", rate: 2, cap: 90, min: 2500, label: "2% at RM2,500 a month" },
      { cats: ["dining", "retail", "entertain"], u: "cb", rate: 1, cap: 90, min: 1000, label: "1% at RM1,000 a month" },
      { cats: ["onlineOs", "overseasRet"], u: "cb", rate: 0.50, label: "0.5% uncapped on overseas spend" },
    ],
    capTotal: 90, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-09",
    signup: { value: 200, minSpend: 2000, window: 60, desc: "Up to RM200 cashback for new primary cardholders" },
    note: "Rebuilt from HSBC's card page. Income is RM102,000, not RM36,000 — this is a far harder card to get than the database implied. The bonus rate is tiered on monthly spend (1% / 2% / 5%) and capped at RM30 a month PER CATEGORY across dining, shopping and entertainment, so RM90 in total. Base earn is 0.2% locally and 0.5% overseas, both uncapped. The extra 3% promotional cashback expired on 30 June 2025." },

  { id: "hsbc-amanah-mpower", bank: "HSBC Amanah", name: "MPower Platinum Card-i", net: "Visa Platinum",
    conv: "cashOnly", fee: 240, waiver: { t: "swipes", v: 12 }, income: 36000,
    base: { u: "cb", rate: 0.20 },
    rules: [{ cats: ["petrol", "groceries", "ewallet"], u: "cb", rate: 8, cap: 50, min: 2000, label: "8% e-wallet, petrol and groceries" }],
    capTotal: 50, fx: 1.00, lounge: null, ins: 0, excl: ["utilities", "insurance", "education"], verified: "2026-05",
    signup: { value: 200, minSpend: 2000, window: 60, desc: "Up to RM200 cashback for new primary cardholders" },
    note: "UNVERIFIED — hsbcamanah.com.my is blocked by the network egress proxy in this environment, so nothing on this card could be re-read in the September 2026 refresh." },

  { id: "hsbc-travelone", bank: "HSBC", name: "TravelOne Credit Card", net: "Visa Signature",
    conv: "hsbc", fee: 0, waiver: { t: "lifetime" }, income: 102000,
    base: { u: "pts", rate: 1 },
    rules: [
      { cats: ["onlineOs", "overseasRet"], u: "pts", rate: 8, label: "8x on all foreign currency spend" },
      { cats: ["travelAir", "hotel"], u: "pts", rate: 5, label: "5x on local travel" },
      { cats: ["dining"], u: "pts", rate: 5, label: "5x on local dining" },
    ],
    capTotal: null, fx: 1.00, lounge: { p: "Plaza Premium", v: 6, g: 0, sup: true }, ins: 1000000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Earn rates and the shared lounge pool confirmed on HSBC's own card page; income is RM102,000. The six Plaza Premium visits are a COMBINED pool for the principal and supplementary cardholder, so a partner can use it without a second card. The annual fee and the travel insurance figure are not stated on that page — HSBC puts them in a separate downloadable schedule that could not be reached — so both are carried over unverified." },

  { id: "hsbc-premier-vi", bank: "HSBC", name: "Premier World Mastercard", net: "World MC",
    conv: "hsbc", fee: 600, waiver: { t: "lifetime" }, income: 0,
    base: { u: "pts", rate: 1 },
    rules: [
      { cats: ["onlineOs", "overseasRet"], u: "pts", rate: 10, label: "10x on overseas spend" },
      { cats: ["retail", "dining"], u: "pts", rate: 8, label: "8x on contactless payments" },
      { cats: ["groceries", "onlineLocal"], u: "pts", rate: 5, label: "5x on groceries and online shopping" },
    ],
    capTotal: null, fx: 1.00, lounge: { p: "Plaza Premium", v: 6, g: 0 }, ins: 2000000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Rebuilt from HSBC's card page. There is no income test — entry is an HSBC Premier relationship balance of RM300,000, so income is set to zero and the relationship requirement noted here instead. Published rates are 10x overseas (plus a further 5x if you hold Premier eligibility each month), 8x contactless and 5x groceries and online, with no stated cap — the per-category caps this database recorded are not published. Lounge is 6 Plaza Premium passes at KLIA1, Singapore and Hong Kong, not 12 Priority Pass. Travel insurance is USD500,000, shown here as roughly RM2,000,000." },

  { id: "sc-journey", bank: "Standard Chartered", name: "Journey Credit Card", net: "Mastercard",
    conv: "milesDirect", fee: 600, waiver: { t: "spend", v: 60000 }, income: 96000,
    base: { u: "pts", rate: 0.50 },
    rules: [
      { cats: ["dining", "travelAir", "hotel", "onlineOs", "overseasRet"], u: "pts", rate: 2.50, label: "5x SC Miles on dining, travel and overseas — 2.5 air miles per RM1" },
    ],
    capTotal: null, fx: 1.01, lounge: { p: "Plaza Premium", v: 999, g: 0 }, ins: 400000,
    excl: EX, verified: "2026-09",
    signup: { value: 150, minSpend: 1500, window: 60, desc: "Welcome cashback or gift" },
    note: "Rebuilt from Standard Chartered's own card page. Income is RM96,000, not RM36,000. It earns SC Miles that convert at 2 SC Miles to 1 air mile, so the headline 5x on dining, travel and overseas is 2.5 air miles per ringgit — modelled directly rather than through the 360° Rewards points table. Lounge is UNLIMITED Plaza Premium at KLIA and klia2 on an international boarding pass, which the database did not record at all. SC adds a 1% administration fee on foreign currency. Travel medical cover is USD100,000, shown here as roughly RM400,000." },

  { id: "sc-simplycash", bank: "Standard Chartered", name: "Simply Cash Credit Card", net: "Visa Platinum",
    conv: "cashOnly", fee: 250, waiver: { t: "swipes", v: 12 }, income: 96000,
    base: { u: "cb", rate: 0.50 },
    rules: [
      { cats: ["petrol", "groceries", "dining"], u: "cb", rate: 15, cap: 40, min: 2500, label: "Up to 15% on petrol, groceries and dining at selected merchants" },
    ],
    capTotal: 40, fx: 1.01, lounge: null, ins: 0,
    excl: ["utilities", "insurance", "education"], verified: "2026-09", signup: NOSIGN,
    note: "Rebuilt from Standard Chartered's card page: this is NOT an uncapped 1.5% flat-rebate card. Base rate is 0.5% capped at RM10 a month below RM2,500 of spend; above RM2,500 selected petrol, grocery and dining merchants pay up to 15%, capped at RM20 each for petrol and for grocery-plus-dining, RM40 in total. Income RM96,000. First year free, RM250 after. SC adds 1% on foreign currency." },

  { id: "sc-worldmiles", bank: "Standard Chartered", name: "WorldMiles World Mastercard", net: "World MC",
    conv: "milesDirect", fee: 600, waiver: { t: "spend", v: 36000 }, income: 100000,
    base: { u: "pts", rate: 0.20 },
    rules: [{ cats: ["onlineOs", "overseasRet", "travelAir", "hotel"], u: "pts", rate: 0.60, label: "Boosted miles on overseas and travel" }],
    capTotal: null, fx: 1.01, lounge: { p: "Plaza Premium", v: 6, g: 0 }, ins: 1000000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "UNVERIFIED apart from the 1% foreign-currency administration fee. Standard Chartered no longer lists a WorldMiles card among its current Malaysian cards — the featured range is Journey, Simply Cash, Platinum Basic and the two Beyond tiers — so this card may have been withdrawn. Confirm it still exists before relying on any figure here." },

  { id: "sc-priority-vi", bank: "Standard Chartered", name: "Beyond Credit Card (Priority Banking)", net: "Visa Infinite",
    conv: "sc", fee: 800, waiver: { t: "lifetime" }, income: 0,
    base: { u: "pts", rate: 2 },
    rules: [{ cats: ["onlineOs", "overseasRet", "travelAir", "hotel"], u: "pts", rate: 6, label: "6x overseas and travel" }],
    capTotal: null, fx: 1.01, lounge: { p: "Priority Pass", v: 12, g: 1 }, ins: 1500000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Renamed: Standard Chartered's current premium card is the Beyond Credit Card. Entry is by assets under management, not income — RM350,000 a month for the Priority Banking tier and RM3,000,000 for Priority Private — so income is set to zero. The fee, earn rates, lounge and insurance below are NOT published on a reachable page and are carried over from the previous build unverified." },

  { id: "uob-one", bank: "UOB", name: "ONE Platinum Card", net: "Visa Platinum",
    conv: "cashOnly", fee: 195, waiver: { t: "spend", v: 20000 }, income: 36000,
    base: { u: "cb", rate: 0.20 },
    rules: [
      { cats: ["groceries", "dining", "petrol", "transport"], u: "cb", rate: 10, cap: 15, min: 1500, label: "10% on petrol, groceries, dining and Grab" },
    ],
    capTotal: 60, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-09",
    signup: { value: 138, minSpend: 500, window: 60, desc: "Up to RM138 welcome cashback, plus RM50 for setting up a recurring payment" },
    note: "UOB's page caps the bonus rate at RM15 a month PER CATEGORY, not RM80 across the card as this database previously had it, and the unlock is RM1,500 a statement cycle. Everything outside the four bonus categories earns 0.2% uncapped. The Classic variant is a separate card: RM120 fee, RM15,000 waiver, RM800 unlock." },

  { id: "uob-evol", bank: "UOB", name: "EVOL Card", net: "Visa Platinum",
    conv: "cashOnly", fee: 90, waiver: { t: "swipes", v: 12 }, income: 36000,
    base: { u: "cb", rate: 0.20 },
    rules: [
      { cats: ["onlineLocal", "onlineOs", "entertain"], u: "cb", rate: 10, cap: 15, min: 1000, label: "10% on online spend" },
      { cats: ["ewallet"], u: "cb", rate: 5, cap: 15, min: 1000, label: "5% on e-wallet reloads" },
    ],
    capTotal: 30, fx: 1.00, lounge: null, ins: 0, excl: ["utilities", "insurance", "education"], verified: "2026-09",
    signup: { value: 88, minSpend: 0, window: 60, desc: "RM88 cashback plus a one-year fee waiver" },
    note: "Billed RM7.50 a statement month (RM90 a year), waived by one retail transaction that month, so in practice it is free if you use it. Rates effective 1 January 2026: 10% online capped RM15, 5% e-wallet capped RM15, both needing RM1,000 a month." },

  { id: "uob-world", bank: "UOB", name: "World Card", net: "World MC",
    conv: "uobStd", fee: 600, waiver: { t: "swipes", v: 12 }, income: 60000,
    base: { u: "pts", rate: 1 },
    rules: [{ cats: ["ewallet"], u: "pts", rate: 8, cap: 7200, label: "Boosted rate on e-wallet reloads" }],
    capTotal: null, fx: 2.25, lounge: null, ins: 0, excl: ["utilities", "insurance", "education"], verified: "2026-09",
    signup: NOSIGN,
    note: "Fee corrected to RM600 from UOB's published annual-fee table (the database had RM195, the Preferred card's fee). About 0.66 miles per ringgit on e-wallet, but capped near RM300 each for Touch 'n Go, Boost and BigPay." },

  { id: "uob-prvi-elite", bank: "UOB", name: "PRVI Miles Elite Card", net: "World MC",
    conv: "uobStd", fee: 600, waiver: { t: "spend", v: 50000 }, income: 100000,
    base: { u: "pts", rate: 1 },
    rules: [
      { cats: ["onlineOs", "overseasRet"], u: "pts", rate: 10, label: "10x UNIRinggit on overseas spend" },
      { cats: ["travelAir"], u: "pts", rate: 5, label: "5x UNIRinggit on airline spend" },
    ],
    capTotal: null, fx: 2.25, lounge: { p: "Plaza Premium", v: 8, g: 0 }, ins: 300000,
    excl: EX, verified: "2026-09",
    signup: { value: 500, minSpend: 0, window: 0, desc: "60,000 bonus UNIRinggit credited each year on payment of the annual fee" },
    note: "0.83 miles per ringgit on foreign currency, rising to 1.00 in Singapore, Thailand, Vietnam and Indonesia where the rate is 12x — the model uses the 10x rest-of-world rate, so regional trips beat what you see here. UOB's terms (effective 1 September 2026) put no cap on the bonus rates. Lounge is 8 visits, one admission a day." },

  { id: "uob-vi", bank: "UOB", name: "Visa Infinite", net: "Visa Infinite",
    conv: "uobStd", fee: 600, waiver: { t: "spend", v: 50000 }, income: 120000,
    base: { u: "pts", rate: 1 },
    rules: [
      { cats: ["onlineOs", "overseasRet"], u: "pts", rate: 10, label: "10x UNIRinggit overseas" },
      { cats: ["dining"], u: "pts", rate: 5, min: 1000, label: "5x UNIRinggit on dining, needs RM1,000 a month" },
    ],
    capTotal: null, fx: 2.25, lounge: { p: "Plaza Premium", v: 12, g: 0 }, ins: 500000,
    excl: EX, verified: "2026-09", signup: { value: 88, minSpend: 0, window: 60, desc: "RM88 cashback plus a one-year fee waiver" },
    note: "Corrected against UOB's card page: income is RM120,000 not RM150,000, the waiver is RM50,000 from 1 January 2026, lounge access is 12 visits not 8, and travel insurance is RM500,000 not RM1,000,000. The 5x dining rate needs RM1,000 of spend that month." },

  { id: "uob-vi-metal", bank: "UOB", name: "Visa Infinite Metal Card", net: "Visa Infinite",
    conv: "uobMetal", fee: 3000, waiver: { t: "none" }, income: 200000,
    base: { u: "pts", rate: 1 },
    rules: [
      { cats: ["onlineOs", "overseasRet"], u: "pts", rate: 10, label: "10x UNIRinggit overseas" },
      { cats: ["dining"], u: "pts", rate: 5, min: 1000, label: "5x UNIRinggit on dining, needs RM1,000 a month" },
    ],
    capTotal: null, fx: 2.25, lounge: { p: "DragonPass", v: 999, g: 1, sup: true }, ins: 1000000,
    excl: EX, verified: "2026-09",
    signup: { value: 3000, minSpend: 0, window: 0, desc: "300,000 bonus UNIRinggit credited each year on payment of the RM3,000 annual fee" },
    note: "By invitation only. UOB's own page contradicts the 2026 'lounge cut' this database previously recorded: access is unlimited through DragonPass for the cardholder AND one guest, and supplementary cardholders keep the same unlimited entitlement. Travel insurance is RM1,000,000, not RM2,000,000. Base earn corrected to 1x; the 300,000 UNIRinggit annual bonus is modelled as the signup value instead." },

  { id: "uob-ladys", bank: "UOB", name: "Lady's Solitaire Card", net: "World MC",
    conv: "uobStd", fee: 300, waiver: { t: "spend", v: 40000 }, income: 100000,
    base: { u: "pts", rate: 1 },
    rules: [{ cats: ["retail", "onlineLocal"], u: "pts", rate: 6, cap: 12000, label: "Boosted rate on fashion and retail, capped near RM2,000" }],
    capTotal: null, fx: 2.25, lounge: { p: "Plaza Premium", v: 4, g: 0 }, ins: 500000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Fee corrected to RM300 from UOB's published annual-fee table (the database had RM800). About 0.50 miles per ringgit on fashion. Issued to women only. Earn rates and lounge are NOT published on a reachable UOB page and are carried over unverified." },

  { id: "uob-lazada", bank: "UOB", name: "Lazada Card", net: "Platinum MC",
    conv: "uobStd", fee: 100, waiver: { t: "swipes", v: 12 }, income: 30000,
    base: { u: "pts", rate: 1 },
    rules: [{ cats: ["onlineLocal", "insurance", "utilities"], u: "pts", rate: 4, cap: 6000, label: "Boosted rate on Lazada, insurance and telco" }],
    capTotal: null, fx: 2.25, lounge: null, ins: 0, excl: ["education"], verified: "2026-09", signup: NOSIGN,
    note: "Fee corrected to RM100 from UOB's published annual-fee table. About 0.36 miles per ringgit. Caps of roughly RM500 each for insurance and telco, Lazada, and selected online spend — not published on a reachable page, carried over unverified." },

  { id: "ocbc-titanium", bank: "OCBC", name: "Titanium Mastercard", net: "Titanium MC",
    conv: "ocbc", fee: 75, waiver: { t: "spend", v: 20000 }, income: 48000,
    base: { u: "pts", rate: 1 },
    rules: [{ cats: ["onlineLocal", "onlineOs", "ewallet", "overseasRet"], u: "pts", rate: 6, cap: 20000, label: "6x on online and e-wallet spend" }],
    capTotal: null, fx: 1.25, lounge: null, ins: 0, excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Corrected against OCBC's card page: fee RM75 waived at RM20,000 of annual spend, income RM48,000. The bonus rate is 6x OCBC$ on online and e-wallet spend, doubling to 12x on Double Dates (1.1, 2.2 and so on) and on payday, the 25th — the model uses the everyday 6x. Bonus earn is capped at 20,000 OCBC$ a cycle, after which it drops to 1x. OCBC adds a 1.25% administration charge on foreign currency." },

  { id: "ocbc-cashflo", bank: "OCBC", name: "Cashflo Mastercard", net: "Platinum MC",
    conv: "cashOnly", fee: 188, waiver: { t: "spend", v: 20000 }, income: 48000,
    base: { u: "cb", rate: 0 }, rules: [],
    capTotal: 0, fx: 1.25, lounge: null, ins: 0, excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Corrected against OCBC's card page: fee RM188 (supplementary RM68), first year waived, later years waived at RM20,000 of annual spend, income RM48,000. OCBC publishes NO cashback or rewards programme for this card — the 1% flat rebate this database recorded is not supported. It automatically converts purchases over RM500 to 3- or 6-month interest-free instalments; it is a cash-flow tool, not a rewards card, and the earn rate is set to zero to reflect that." },

  { id: "ocbc-great-eastern", bank: "OCBC", name: "Great Eastern Platinum", net: "Visa Platinum",
    conv: "ocbc", fee: 138, waiver: { t: "swipes", v: 12 }, income: 36000,
    base: { u: "pts", rate: 1 },
    rules: [{ cats: ["insurance"], u: "pts", rate: 3, label: "3x on Great Eastern premiums" }],
    capTotal: null, fx: 1.25, lounge: null, ins: 0, excl: ["utilities", "education"], verified: "2026-09", signup: NOSIGN,
    note: "Fee corrected to RM138 from OCBC's published fees and charges table, and the FX markup to OCBC's 1.25% administration charge. Income, waiver and the 3x premium rate are not published on a reachable page and are carried over unverified." },

  { id: "affin-duo", bank: "Affin Bank", name: "Duo Visa & Mastercard", net: "Visa + MC",
    conv: "cashOnly", fee: 75, waiver: { t: "swipes", v: 12 }, income: 24000,
    base: { u: "cb", rate: 0.25 },
    rules: [{ cats: ["*"], u: "cb", rate: 5, cap: 50, wknd: true, label: "5% weekend cashback on the cash-back face" }],
    capTotal: 50, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Fee corrected to RM75 in year one and RM30 after, waived on 12 swipes, from Affin's published fees and charges schedule; the database had it free for life. Affin's DUO pairs a Visa Cash Back face with a Mastercard Rewards face — not an Amex. The cashback rate and cap are not published there and are carried over unverified." },

  { id: "affin-invikta", bank: "Affin Bank", name: "Invikta World Mastercard", net: "World MC",
    conv: "affin", fee: 500, waiver: { t: "spend", v: 100000 }, income: 180000,
    base: { u: "pts", rate: 1 },
    rules: [{ cats: ["onlineOs", "overseasRet", "travelAir", "hotel"], u: "pts", rate: 5, label: "5x overseas and travel" }],
    capTotal: null, fx: 1.00, lounge: { p: "Plaza Premium", v: 6, g: 0 }, ins: 1000000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Corrected against Affin's fees and charges schedule: RM500 in year one and RM400 after, waived at RM100,000 of annual spend or 12 swipes, with a minimum income of RM180,000 — well above the RM150,000 this database recorded. Earn rates, lounge and insurance are not published there and are carried over unverified." },

  { id: "bi-vi", bank: "Bank Islam", name: "Visa Infinite Credit Card-i", net: "Visa Infinite",
    conv: "islam", fee: 150, waiver: { t: "swipes", v: 12 }, income: 120000,
    base: { u: "pts", rate: 1 },
    rules: [{ cats: ["onlineOs", "overseasRet", "travelAir"], u: "pts", rate: 3, label: "3x overseas and travel" }],
    capTotal: null, fx: 1.00, lounge: { p: "Plaza Premium", v: 4, g: 0 }, ins: 500000,
    excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Fee corrected to RM150 after a free first year, from Bank Islam's published Credit Card-i fee schedule; the database had RM500 with an RM30,000 spend waiver. Bank Islam's lounge rule is one card per person per visit per day, three hours maximum. Income, earn rates and insurance are not published on a reachable page and are carried over unverified." },

  { id: "bi-plat", bank: "Bank Islam", name: "Platinum Card-i", net: "Visa Platinum",
    conv: "cashOnly", fee: 0, waiver: { t: "lifetime" }, income: 24000,
    base: { u: "cb", rate: 0.50 },
    rules: [{ cats: ["petrol", "groceries"], u: "cb", rate: 3, cap: 25, label: "3% petrol and groceries" }],
    capTotal: 25, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Income corrected to RM24,000, the entry requirement Bank Islam publishes for its Credit Card-i range. Fee and earn rates are carried over unverified." },

  { id: "br-plat", bank: "Bank Rakyat", name: "Platinum Card-i", net: "Visa Platinum",
    conv: "cashOnly", fee: 388, waiver: { t: "swipes", v: 1 }, income: 30000,
    base: { u: "cb", rate: 0.50 },
    rules: [{ cats: ["petrol", "groceries", "dining"], u: "cb", rate: 3, cap: 30, min: 1000, label: "3% on everyday categories" }],
    capTotal: 30, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Fee corrected to RM388 principal (RM150 supplementary), waived in later years on a single card use, from Bank Rakyat's product disclosure sheet — the database had it free for life with no conditions. Income and earn rates are carried over unverified; note Bank Rakyat's Platinum Explorer variant asks RM60,000." },

  { id: "bsn-plat", bank: "BSN", name: "Platinum Credit Card", net: "Visa Platinum",
    conv: "cashOnly", fee: 0, waiver: { t: "lifetime" }, income: 48000,
    base: { u: "cb", rate: 0.50 },
    rules: [{ cats: ["petrol"], u: "cb", rate: 3, cap: 20, label: "3% petrol" }],
    capTotal: 20, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-09", signup: NOSIGN,
    note: "Income corrected to RM48,000 from BSN's card page; the database had RM24,000. BSN's separate AIAFAM Visa Platinum asks RM32,000 and charges no annual fee. Fee and earn rates here are carried over unverified." },

  { id: "aeon-gold", bank: "AEON Credit", name: "Gold Visa / Mastercard", net: "Gold",
    conv: "aeon", fee: 0, waiver: { t: "lifetime" }, income: 18000,
    base: { u: "pts", rate: 1 },
    rules: [{ cats: ["groceries", "retail"], u: "pts", rate: 3, label: "3x at AEON stores" }],
    capTotal: null, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-05", signup: NOSIGN,
    note: "UNVERIFIED — aeoncredit.com.my could not be reached from this environment, so nothing on this card was re-checked in the September 2026 refresh. Lowest income barrier here, which makes it a reasonable first card for building credit history." },

  { id: "aeon-plat", bank: "AEON Credit", name: "Platinum Visa", net: "Visa Platinum",
    conv: "aeon", fee: 0, waiver: { t: "lifetime" }, income: 36000,
    base: { u: "pts", rate: 1 },
    rules: [{ cats: ["groceries", "retail", "dining"], u: "pts", rate: 5, cap: 8000, label: "5x at AEON and selected merchants" }],
    capTotal: null, fx: 1.00, lounge: null, ins: 0, excl: EX, verified: "2026-05", signup: NOSIGN,
    note: "UNVERIFIED — aeoncredit.com.my could not be reached from this environment." },
];

/* ---------------------------------------------------------------------------
   6. DEFAULTS
   Every figure the USER enters starts at zero — the dashboard should never
   show anyone else's guess about your spending. The valuation constants below
   (mile values, service tax, lounge value) are model parameters, not "your"
   figures, so they keep sensible starting points editable in the Valuation tab.
   ------------------------------------------------------------------------- */
const DEFAULT_ASSUM = {
  mile: Object.fromEntries(Object.entries(FFP).map(([k, v]) => [k, v.def])),
  wkndShare: 0.30,
  loungeValue: 100,
  insValue: 150,
  serviceTax: 25,
  applyBlock: true,
  includeSignup: false,
  horizon: 5,
  applyDeval: true,
  tripMonths: 2,   // months of the year your flights and hotels actually land in
};

const DEFAULT_PROFILE = {
  spend: Object.fromEntries(CATS.map((c) => [c.key, 0])),
  income: 0, maxFee: 0, loungeWanted: 0, flights: 0,
  paysInFull: true, goal: "any",
};

/* ---------------------------------------------------------------------------
   7. FORMATTING — always thousand-separated, 2dp for ringgit
   ------------------------------------------------------------------------- */
const fmt = (n) => (Number.isFinite(n) ? n : 0)
  .toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt0 = (n) => (Number.isFinite(n) ? n : 0)
  .toLocaleString("en-MY", { maximumFractionDigits: 0 });
const fmt4 = (n) => (Number.isFinite(n) ? n : 0)
  .toLocaleString("en-MY", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
const rm = (n) => `RM ${fmt(n)}`;

/* ---------------------------------------------------------------------------
   8. POINT VALUATION
   ------------------------------------------------------------------------- */
function valueRoutes(convKey, convOverrides, mileVals) {
  const c = { ...CONV[convKey], ...(convOverrides[convKey] || {}) };
  const routes = [];
  if (c.cashPer1 > 0) {
    routes.push({ key: "cash", label: "Cash or voucher", rm: 1 / c.cashPer1,
      detail: `${fmt0(c.cashPer1)} points = RM 1.00` });
  }
  Object.entries(c.ffp || {}).forEach(([k, ptsPer1000]) => {
    if (!ptsPer1000 || !FFP[k]) return;
    const milesPerPoint = 1000 / ptsPer1000;
    routes.push({
      key: k, label: `${FFP[k].name} (${FFP[k].airline})`,
      rm: milesPerPoint * (mileVals[k] ?? FFP[k].def),
      detail: `${fmt0(ptsPer1000)} points = 1,000 ${FFP[k].name}`,
    });
  });
  routes.sort((a, b) => b.rm - a.rm);
  return { conv: c, routes, best: routes[0] || { key: "none", label: "No redemption route", rm: 0, detail: "" } };
}

/* ---------------------------------------------------------------------------
   9. SCORING ENGINE
   ------------------------------------------------------------------------- */
function earnMonth(card, monthSpend, A, pv) {
  const excl = new Set(card.excl || []);
  let qual = 0;
  CATS.forEach((c) => { if (!excl.has(c.key)) qual += monthSpend[c.key] || 0; });

  const capUsed = {};
  let cbMonth = 0, ptsMonth = 0;
  const perCat = {};

  CATS.forEach((c) => {
    const amt = monthSpend[c.key] || 0;
    if (amt <= 0) return;
    if (excl.has(c.key)) { perCat[c.key] = { value: 0, rule: "Excluded by issuer" }; return; }

    const active = (card.rules || []).map((r, i) => ({ ...r, _i: i }))
      .filter((r) => (r.cats.includes("*") || r.cats.includes(c.key)) && (!r.min || qual >= r.min));
    const wkndRules = active.filter((r) => r.wknd);
    const anyRules = active.filter((r) => !r.wknd);

    const segs = wkndRules.length
      ? [{ amt: amt * A.wkndShare, pool: [...wkndRules, ...anyRules] },
         { amt: amt * (1 - A.wkndShare), pool: anyRules }]
      : [{ amt, pool: anyRules }];

    let catValue = 0, ruleLabel = "Base rate";
    const basePerRM = card.base.u === "cb" ? card.base.rate / 100 : card.base.rate * pv;

    segs.forEach((seg) => {
      let remaining = seg.amt;
      if (remaining <= 0) return;
      const ranked = [...seg.pool].sort((a, b) => {
        const va = a.u === "cb" ? a.rate / 100 : a.rate * pv;
        const vb = b.u === "cb" ? b.rate / 100 : b.rate * pv;
        return vb - va;
      });
      for (const r of ranked) {
        if (remaining <= 0) break;
        const perRM = r.u === "cb" ? r.rate / 100 : r.rate * pv;
        if (perRM <= basePerRM) continue;
        const rawFull = r.u === "cb" ? (remaining * r.rate) / 100 : remaining * r.rate;
        let raw = rawFull;
        if (r.cap != null) {
          const used = capUsed[r._i] || 0;
          raw = Math.min(rawFull, Math.max(0, r.cap - used));
          capUsed[r._i] = used + raw;
        }
        const frac = rawFull > 0 ? raw / rawFull : 0;
        if (r.u === "cb") { cbMonth += raw; catValue += raw; }
        else { ptsMonth += raw; catValue += raw * pv; }
        if (raw > 0) ruleLabel = r.label;
        remaining -= remaining * frac;
      }
      if (remaining > 0) {
        if (card.base.u === "cb") { const v = (remaining * card.base.rate) / 100; cbMonth += v; catValue += v; }
        else { const p = remaining * card.base.rate; ptsMonth += p; catValue += p * pv; }
      }
    });
    perCat[c.key] = { value: catValue, rule: ruleLabel };
  });

  let capLoss = 0;
  if (card.capTotal != null && cbMonth > card.capTotal) { capLoss = cbMonth - card.capTotal; cbMonth = card.capTotal; }
  return { cb: cbMonth, pts: ptsMonth, capLoss, qual, perCat };
}

function evaluateCard(card, spend, A, P, convOverrides) {
  const { conv, best, routes } = valueRoutes(card.conv, convOverrides, A.mile);
  const pv = best.rm;

  // Split the year: annual categories (flights, hotels, overseas retail) land
  // only inside `tripMonths`, spread evenly between them. Everything else
  // repeats every month. Each month type is then priced separately, so monthly
  // caps bite on the trip months the way they really would.
  const tripMonths = Math.min(12, Math.max(1, Math.round(A.tripMonths || 1)));
  const plainMonths = 12 - tripMonths;
  const plainSpend = {}, tripSpend = {};
  let annualTotal = 0, annualFx = 0;
  CATS.forEach((c) => {
    const amt = spend[c.key] || 0;
    plainSpend[c.key] = c.annual ? 0 : amt;
    tripSpend[c.key] = c.annual ? amt / tripMonths : amt;
    const yearAmt = c.annual ? amt : amt * 12;
    annualTotal += yearAmt;
    if (c.fx) annualFx += yearAmt;
  });

  const plain = earnMonth(card, plainSpend, A, pv);
  // With no annual spend entered, both month types are identical — skip the work.
  const hasAnnual = ANNUAL_CATS.some((c) => (spend[c.key] || 0) > 0);
  const trip = hasAnnual ? earnMonth(card, tripSpend, A, pv) : plain;
  const overYear = (pick) => pick(plain) * plainMonths + pick(trip) * tripMonths;

  const cbYear = overYear((m) => m.cb);
  const capLoss = overYear((m) => m.capLoss);
  const annualQual = overYear((m) => m.qual);
  let ptsYear = overYear((m) => m.pts);
  const ptsEarned = ptsYear;

  const perCat = [];
  CATS.forEach((c) => {
    const amt = spend[c.key] || 0;
    if (amt <= 0) return;
    const value = (plain.perCat[c.key]?.value || 0) * plainMonths
                + (trip.perCat[c.key]?.value || 0) * tripMonths;
    const rule = trip.perCat[c.key]?.rule || plain.perCat[c.key]?.rule || "Base rate";
    perCat.push({ cat: c.key, amt, annual: !!c.annual, value, rule });
  });

  let blockLoss = 0, blocksPerYear = 0;
  if (ptsYear > 0 && best.key !== "cash" && best.key !== "none") {
    if (A.applyBlock && conv.block > 1) {
      blocksPerYear = Math.floor(ptsYear / conv.block);
      const usable = blocksPerYear * conv.block;
      blockLoss = (ptsYear - usable) * pv;
      ptsYear = usable;
    }
  }
  const ptsValue = ptsYear * pv;
  const milesYear = best.key !== "cash" && best.key !== "none" && conv.ffp[best.key]
    ? (ptsYear / conv.ffp[best.key]) * 1000 : 0;
  const mpr = annualTotal > 0 ? milesYear / annualTotal : 0;

  const loungeUsed = card.lounge ? Math.min(P.loungeWanted, card.lounge.v) : 0;
  const loungeValue = loungeUsed * A.loungeValue;
  const insValue = card.ins > 0 && P.flights > 0 ? A.insValue : 0;

  let feeCharged = card.fee, waiverNote = "";
  if (card.waiver.t === "lifetime") { feeCharged = 0; waiverNote = "Waived for life"; }
  else if (card.waiver.t === "spend") {
    feeCharged = annualQual >= card.waiver.v ? 0 : card.fee;
    waiverNote = annualQual >= card.waiver.v
      ? `Waived, annual spend of ${rm(annualQual)} clears ${rm(card.waiver.v)}`
      : `Charged, you are ${rm(card.waiver.v - annualQual)} short of the waiver`;
  } else if (card.waiver.t === "swipes") { feeCharged = 0; waiverNote = `Waived with ${card.waiver.v} swipes a year`; }
  else { waiverNote = "No waiver available"; }

  const fxCost = (annualFx * card.fx) / 100;
  const convFee = blocksPerYear * (conv.fee || 0);
  const tax = A.serviceTax;

  const signupValue = A.includeSignup && annualQual >= (card.signup?.minSpend || 0)
    ? (card.signup?.value || 0) : 0;

  const gross = cbYear + ptsValue + loungeValue + insValue;
  const costs = feeCharged + tax + fxCost + convFee;
  const net = gross - costs;
  const netY1 = net + signupValue;

  const dev = devalFor(card.conv);
  const rate = A.applyDeval ? dev.annual : 0;
  const years = [];
  let cum = 0;
  for (let y = 1; y <= A.horizon; y++) {
    const decay = Math.pow(1 - rate, y - 1);
    const yearNet = (cbYear + ptsValue) * decay + loungeValue + insValue - costs + (y === 1 ? signupValue : 0);
    cum += yearNet;
    years.push({ y, net: yearNet, cum });
  }

  const flags = [];
  if (P.income < card.income) flags.push(`Income below the RM ${fmt0(card.income)} minimum`);
  if (card.fee > P.maxFee && feeCharged > 0) flags.push("Annual fee above your ceiling");
  if (capLoss > 0) flags.push(`Card cap wastes ${rm(capLoss)} of rebate a year`);
  if (card.waiver.t === "spend" && feeCharged > 0) flags.push("Fee waiver not reached");
  if (blockLoss > 5) flags.push(`${rm(blockLoss)} stranded below the ${fmt0(conv.block)}-point transfer block`);
  if (!conv.sourced && ptsValue > 0) flags.push("Conversion rate not sourced to an issuer page");
  if (ptsEarned > 0 && conv.block > 0 && ptsEarned < conv.block)
    flags.push(`A year of spending earns ${fmt0(ptsEarned)} points, below the ${fmt0(conv.block)} minimum transfer`);

  return {
    card, conv, best, routes, pv, net, netY1, gross, cbYear, ptsYear, ptsEarned, ptsValue,
    milesYear, mpr, loungeValue, insValue, signupValue, feeCharged, tax, fxCost, convFee,
    costs, capLoss, blockLoss, blocksPerYear, waiverNote, perCat, years, annualTotal,
    devalRate: dev.annual, devalEvents: dev.events, annualQual, loungeUsed, flags,
    eligible: P.income >= card.income,
  };
}

/* ---------------------------------------------------------------------------
   10. WALLET OPTIMISER — greedy assignment with local-search improvement
   ------------------------------------------------------------------------- */
/* Lounge access and travel insurance are per person, not per card: holding
   three cards with lounge rights does not get you into the lounge three times.
   They are therefore stripped out of each card's own net and allocated once
   across the wallet here — optionally covering a partner travelling with you. */
function allocatePerks(cards, A, P, partner) {
  const withLounge = cards.filter((c) => c.lounge)
    .sort((a, b) => b.lounge.v - a.lounge.v);

  const out = { yourCard: null, yourVisits: 0, partnerCard: null, partnerVisits: 0,
                ridesAlong: 0, loungeValue: 0, insValue: 0, warning: "" };

  if (withLounge.length) {
    out.yourCard = withLounge[0];
    out.yourVisits = Math.min(P.loungeWanted, out.yourCard.lounge.v);
  }

  if (partner.on && partner.visits > 0 && out.yourCard) {
    const l = out.yourCard.lounge;
    // A guest allowance, or a pool shared with the supplementary cardholder,
    // means your partner walks in on YOUR card and needs no second card.
    const freeRide = (l.g > 0 || l.sup) ? out.yourVisits : 0;
    out.ridesAlong = Math.min(partner.visits, freeRide);
    out.partnerVisits = out.ridesAlong;
    const short = partner.visits - out.ridesAlong;
    if (short > 0 && withLounge[1]) {
      out.partnerCard = withLounge[1];
      out.partnerVisits += Math.min(short, out.partnerCard.lounge.v);
      if (out.partnerCard.bank === "UOB" && out.yourCard.bank === "UOB") {
        out.warning = "Both lounge cards are UOB. UOB's terms limit its lounge benefit to one admission per cardmember per day, and the September 2026 refresh could not confirm on a UOB page whether a second UOB card admits a second person — check before relying on it.";
      }
    }
  }

  out.loungeValue = (out.yourVisits + out.partnerVisits) * A.loungeValue;
  out.insValue = P.flights > 0 && cards.some((c) => c.ins > 0) ? A.insValue : 0;
  return out;
}

function evaluateWallet(cards, spend, A, P, convOverrides, partner = { on: false, visits: 0 }) {
  const n = cards.length;
  // Price each card WITHOUT lounge or insurance; both are added back once below.
  const bare = { ...P, loungeWanted: 0, flights: 0 };
  const assign = Object.fromEntries(CATS.map((c) => [c.key, 0]));
  const totalFor = (asg) => {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const sub = Object.fromEntries(CATS.map((c) => [c.key, asg[c.key] === i ? spend[c.key] || 0 : 0]));
      sum += evaluateCard(cards[i], sub, A, bare, convOverrides).net;
    }
    return sum;
  };
  let best = totalFor(assign);
  for (let pass = 0; pass < 3; pass++) {
    let improved = false;
    for (const c of CATS) {
      const cur = assign[c.key];
      for (let i = 0; i < n; i++) {
        if (i === cur) continue;
        assign[c.key] = i;
        const t = totalFor(assign);
        if (t > best + 0.01) { best = t; improved = true; break; }
        assign[c.key] = cur;
      }
    }
    if (!improved) break;
  }
  const detail = cards.map((cd, i) => {
    const sub = Object.fromEntries(CATS.map((c) => [c.key, assign[c.key] === i ? spend[c.key] || 0 : 0]));
    return { ...evaluateCard(cd, sub, A, bare, convOverrides),
             assigned: CATS.filter((c) => assign[c.key] === i).map((c) => c.label) };
  });
  const perks = allocatePerks(cards, A, P, partner);
  return { total: best + perks.loungeValue + perks.insValue, cardsNet: best, perks, detail, assign };
}

/* ---------------------------------------------------------------------------
   11. UI PRIMITIVES
   ------------------------------------------------------------------------- */
function Field({ label, hint, children }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[13px] font-medium text-stone-700 dark:text-zinc-300">{label}</span>
        {hint && <span className="text-[11px] text-stone-400 dark:text-zinc-500">{hint}</span>}
      </div>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function NumInput({ value, onChange, prefix = "RM", step = 50, min = 0 }) {
  return (
    <div className="flex items-stretch rounded-md border border-stone-300 bg-white focus-within:border-emerald-700 focus-within:ring-1 focus-within:ring-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-within:border-emerald-500 dark:focus-within:ring-emerald-500">
      {prefix && <span className="flex items-center px-2 text-[12px] text-stone-400 border-r border-stone-200 dark:text-zinc-500 dark:border-zinc-700">{prefix}</span>}
      <input type="number" inputMode="decimal" step={step} min={min} value={value}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
        className="w-full min-w-0 px-2 py-2 text-[16px] sm:text-[14px] tabular-nums outline-none bg-transparent text-stone-900 dark:text-zinc-100" />
    </div>
  );
}

function Toggle({ on, onChange, label }) {
  return (
    <button onClick={() => onChange(!on)}
      className={`rounded-full border px-3 py-1.5 text-[12px] transition-colors ${
        on ? "border-emerald-800 bg-emerald-800 text-white dark:border-emerald-600 dark:bg-emerald-600"
           : "border-stone-300 text-stone-600 hover:border-stone-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500"}`}>
      {label}
    </button>
  );
}

function SourceBadge({ conv }) {
  if (conv.sourced) {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
        <ShieldCheck size={10} /> Sourced {conv.srcDate}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-800 dark:bg-amber-950/50 dark:text-amber-400">
      <AlertTriangle size={10} /> Not sourced — edit before trusting
    </span>
  );
}

function ValueBar({ e }) {
  const scale = Math.max(e.gross, e.costs, 1);
  const w = (v) => `${Math.min(100, (v / scale) * 100)}%`;
  return (
    <div className="space-y-1">
      <div className="flex h-2 w-full overflow-hidden rounded-sm bg-stone-100 dark:bg-zinc-800">
        <div className="bg-emerald-700 dark:bg-emerald-600" style={{ width: w(e.cbYear + e.ptsValue) }} />
        <div className="bg-sky-600" style={{ width: w(e.loungeValue + e.insValue) }} />
      </div>
      <div className="flex h-2 w-full overflow-hidden rounded-sm bg-stone-100 dark:bg-zinc-800">
        <div className="bg-rose-400 dark:bg-rose-500" style={{ width: w(e.costs) }} />
      </div>
    </div>
  );
}

/* Hand-rolled SVG line chart — responsive by viewBox, no chart library. */
function CumulativeChart({ series, horizon, dark }) {
  const W = 640, H = 240, PL = 52, PR = 16, PT = 16, PB = 30;
  const all = series.flatMap((s) => s.years.map((p) => p.cum));
  const lo = Math.min(0, ...all), hi = Math.max(1, ...all);
  const x = (y) => PL + ((y - 1) / Math.max(1, horizon - 1)) * (W - PL - PR);
  const yy = (v) => PT + (1 - (v - lo) / (hi - lo || 1)) * (H - PT - PB);
  const colors = dark
    ? ["#34d399", "#38bdf8", "#fbbf24", "#fb7185", "#a5b4fc"]
    : ["#065f46", "#0369a1", "#b45309", "#9f1239", "#4338ca"];
  const gridColor = dark ? "#3f3f46" : "#e7e5e4";
  const textColor = dark ? "#71717a" : "#a8a29e";
  const zeroColor = dark ? "#a1a1aa" : "#78716c";

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Cumulative net value by year">
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const v = lo + f * (hi - lo);
          return (
            <g key={f}>
              <line x1={PL} x2={W - PR} y1={yy(v)} y2={yy(v)} stroke={gridColor} strokeWidth="1" />
              <text x={PL - 6} y={yy(v) + 3} textAnchor="end" fontSize="9" fill={textColor}>{fmt0(v)}</text>
            </g>
          );
        })}
        {Array.from({ length: horizon }, (_, i) => i + 1).map((y) => (
          <text key={y} x={x(y)} y={H - 10} textAnchor="middle" fontSize="9" fill={textColor}>Yr {y}</text>
        ))}
        {lo < 0 && <line x1={PL} x2={W - PR} y1={yy(0)} y2={yy(0)} stroke={zeroColor} strokeWidth="1" strokeDasharray="3 3" />}
        {series.map((s, i) => (
          <g key={s.label}>
            <polyline fill="none" stroke={colors[i % colors.length]} strokeWidth="2"
              points={s.years.map((p) => `${x(p.y)},${yy(p.cum)}`).join(" ")} />
            {s.years.map((p) => (
              <circle key={p.y} cx={x(p.y)} cy={yy(p.cum)} r="2.5" fill={colors[i % colors.length]} />
            ))}
          </g>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {series.map((s, i) => (
          <span key={s.label} className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-zinc-400">
            <i className="h-2 w-3 rounded-sm" style={{ background: colors[i % colors.length] }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   12. THEME TOGGLE
   ------------------------------------------------------------------------- */
function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("cc-theme");
      if (saved) return saved === "dark";
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch { return false; }
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("cc-theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);
  return [dark, setDark];
}

/* ---------------------------------------------------------------------------
   13. MAIN COMPONENT
   ------------------------------------------------------------------------- */
function CreditCardDashboard() {
  const [dark, setDark] = useTheme();
  const [tab, setTab] = useState("rank");
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [assum, setAssum] = useState(DEFAULT_ASSUM);
  const [convOverrides, setConvOverrides] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [compare, setCompare] = useState([]);
  const [query, setQuery] = useState("");
  const [bankFilter, setBankFilter] = useState("All");
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [walletSize, setWalletSize] = useState(2);
  const [partner, setPartner] = useState({ on: false, visits: 4 });
  const [redeem, setRedeem] = useState({ miles: 90000, cash: 4200, taxes: 400, ffp: "krisflyer" });

  const setSpend = (k, v) => setProfile((p) => ({ ...p, spend: { ...p.spend, [k]: v } }));
  const setConvField = (key, field, ffpKey, val) =>
    setConvOverrides((o) => {
      const cur = { ...CONV[key], ...(o[key] || {}) };
      const next = ffpKey
        ? { ...cur, ffp: { ...cur.ffp, [ffpKey]: val } }
        : { ...cur, [field]: val };
      return { ...o, [key]: next };
    });

  // Mixed periods, so the only honest headline figure is the annual one.
  const annualSpend = useMemo(
    () => CATS.reduce((s, c) => s + (profile.spend[c.key] || 0) * (c.annual ? 1 : 12), 0),
    [profile.spend]);

  const ranked = useMemo(() => {
    let list = CARDS.map((c) => evaluateCard(c, profile.spend, assum, profile, convOverrides));
    if (onlyEligible) list = list.filter((e) => e.eligible);
    if (profile.goal === "cash") list = list.filter((e) => e.best.key === "cash");
    if (profile.goal === "miles") list = list.filter((e) => e.best.key !== "cash" && e.best.key !== "none");
    return list.sort((a, b) => (assum.includeSignup ? b.netY1 - a.netY1 : b.net - a.net));
  }, [profile, assum, onlyEligible, convOverrides]);

  const bestCard = ranked[0];

  const wallet = useMemo(() => {
    const pool = ranked.slice(0, 8).map((e) => e.card);
    // With partner lounge on, make sure lounge-capable cards are actually in the
    // running even if they rank outside the top 8 on rewards alone.
    if (partner.on) {
      ranked.filter((e) => e.card.lounge).slice(0, 2).forEach((e) => {
        if (!pool.includes(e.card)) pool.push(e.card);
      });
    }
    if (pool.length < walletSize) return null;
    const combos = [];
    const build = (start, cur) => {
      if (cur.length === walletSize) { combos.push([...cur]); return; }
      for (let i = start; i < pool.length; i++) { cur.push(pool[i]); build(i + 1, cur); cur.pop(); }
    };
    build(0, []);
    let bestW = null;
    combos.forEach((cmb) => {
      const r = evaluateWallet(cmb, profile.spend, assum, profile, convOverrides, partner);
      if (!bestW || r.total > bestW.total) bestW = { ...r, cards: cmb };
    });
    return bestW;
  }, [ranked, walletSize, profile, assum, convOverrides, partner]);

  const banks = useMemo(() => ["All", ...new Set(CARDS.map((c) => c.bank))], []);
  const dbList = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CARDS.filter((c) =>
      (bankFilter === "All" || c.bank === bankFilter) &&
      (!q || `${c.bank} ${c.name} ${c.net}`.toLowerCase().includes(q)));
  }, [query, bankFilter]);

  const toggleCompare = (id) =>
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length < 3 ? [...c, id] : c));

  const impliedMile = useMemo(() => {
    const net = redeem.cash - redeem.taxes;
    return redeem.miles > 0 ? net / redeem.miles : 0;
  }, [redeem]);

  const TABS = [
    { k: "profile", label: "Spending",   icon: SlidersHorizontal },
    { k: "rank",    label: "Ranking",    icon: Trophy },
    { k: "years",   label: "Multi-year", icon: TrendingDown },
    { k: "wallet",  label: "Wallet",     icon: Wallet },
    { k: "compare", label: "Compare",    icon: Layers },
    { k: "db",      label: "Cards",      icon: Database },
    { k: "assum",   label: "Valuation",  icon: Settings2 },
  ];

  const unsourcedCount = new Set(CARDS.map((c) => c.conv)).size
    - Object.values(CONV).filter((c) => c.sourced).length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
      {/* ---------------- HEADER ---------------- */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-emerald-800 text-white dark:bg-emerald-600">
            <Wallet size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[15px] font-semibold leading-tight">Malaysian credit card optimiser</h1>
            <p className="truncate text-[11px] text-stone-500 dark:text-zinc-400">
              {rm(annualSpend)} a year · {assum.includeSignup ? "year one, sign-up bonuses included" : "steady state, no sign-up bonuses"}
            </p>
          </div>
          <button onClick={() => setDark((d) => !d)}
            aria-label="Toggle dark mode"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-stone-300 text-stone-600 hover:border-stone-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500">
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          {bestCard && (
            <div className="hidden sm:block shrink-0 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-right dark:border-emerald-900 dark:bg-emerald-950/40">
              <div className="text-[10px] text-emerald-800/70 dark:text-emerald-400/70">Top card</div>
              <div className="text-[13px] font-semibold text-emerald-900 dark:text-emerald-300">{bestCard.card.bank} {bestCard.card.name}</div>
              <div className="text-[12px] tabular-nums text-emerald-800 dark:text-emerald-400">
                {rm(assum.includeSignup ? bestCard.netY1 : bestCard.net)} a year
              </div>
            </div>
          )}
        </div>
        {bestCard && (
          <div className="sm:hidden border-t border-emerald-100 bg-emerald-50 px-4 py-2 dark:border-emerald-900 dark:bg-emerald-950/40">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-[12px] font-medium text-emerald-900 dark:text-emerald-300">{bestCard.card.bank} {bestCard.card.name}</span>
              <span className="shrink-0 text-[13px] font-semibold tabular-nums text-emerald-800 dark:text-emerald-400">
                {rm(assum.includeSignup ? bestCard.netY1 : bestCard.net)}/yr
              </span>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        {/* ---------------- DESKTOP RAIL ---------------- */}
        <nav className="hidden md:flex w-52 shrink-0 flex-col gap-0.5 border-r border-stone-200 p-3 dark:border-zinc-800">
          {TABS.map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] transition-colors ${
                tab === t.k ? "bg-emerald-800 text-white dark:bg-emerald-600"
                            : "text-stone-600 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-900"}`}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
          <div className="mt-4 rounded-md border border-stone-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-[11px] font-medium text-stone-700 dark:text-zinc-300">Data provenance</div>
            <p className="mt-1 text-[11px] leading-relaxed text-stone-500 dark:text-zinc-500">
              Card terms last reviewed {DATA_REVIEWED}. Conversion tables for CIMB, UOB PRVI, RHB and
              direct-Enrich cards were read off the issuer's own page and carry a green badge;
              {" "}{unsourcedCount} programmes are unsourced and carry an amber badge — among them
              Maybank and UOB's metal tier, whose rewards catalogues could not be reached during this
              refresh. Edit those in the Valuation tab before you rely on them.
            </p>
          </div>
        </nav>

        {/* ---------------- MAIN ---------------- */}
        <main className="min-w-0 flex-1 px-4 pb-24 pt-4 md:pb-8">

          {/* ===== SPENDING ===== */}
          {tab === "profile" && (
            <section className="space-y-5">
              <div>
                <h2 className="text-[17px] font-semibold">Your spending</h2>
                <p className="mt-1 max-w-[62ch] text-[13px] text-stone-600 dark:text-zinc-400">
                  Enter what you actually put on a card. Cash and bank transfers don't count.
                  Everything starts at zero — nothing here is a guess about your spending.
                </p>
              </div>

              <div>
                <h3 className="text-[14px] font-semibold">Every month</h3>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {MONTHLY_CATS.map((c) => (
                    <div key={c.key} className="rounded-lg border border-stone-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                      <Field label={c.label} hint={c.fx ? "foreign currency" : "per month"}>
                        <NumInput value={profile.spend[c.key]} onChange={(v) => setSpend(c.key, v)} />
                      </Field>
                      <div className="mt-2 flex gap-1">
                        {[0, 250, 500, 1000, 2000].map((v) => (
                          <button key={v} onClick={() => setSpend(c.key, v)}
                            className="flex-1 rounded border border-stone-200 py-1 text-[11px] tabular-nums text-stone-600 hover:border-emerald-700 hover:text-emerald-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-emerald-500 dark:hover:text-emerald-400">
                            {v >= 1000 ? `${v / 1000}k` : v}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-sky-200 bg-sky-50/60 p-3 dark:border-sky-900 dark:bg-sky-950/30">
                <h3 className="text-[14px] font-semibold">Travel — entered per year</h3>
                <p className="mt-1 max-w-[62ch] text-[12px] text-stone-600 dark:text-zinc-400">
                  Flights and hotels arrive in lumps, not monthly instalments, so enter the yearly
                  total. It matters: RM6,000 of flights inside one statement month runs into a
                  monthly cashback cap that the same money spread over twelve months would not.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {ANNUAL_CATS.map((c) => (
                    <div key={c.key} className="rounded-lg border border-stone-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                      <Field label={c.label} hint={c.fx ? "foreign currency · per year" : "per year"}>
                        <NumInput value={profile.spend[c.key]} step={500} onChange={(v) => setSpend(c.key, v)} />
                      </Field>
                      <div className="mt-2 flex gap-1">
                        {[0, 2000, 5000, 10000, 20000].map((v) => (
                          <button key={v} onClick={() => setSpend(c.key, v)}
                            className="flex-1 rounded border border-stone-200 py-1 text-[11px] tabular-nums text-stone-600 hover:border-emerald-700 hover:text-emerald-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-emerald-500 dark:hover:text-emerald-400">
                            {v >= 1000 ? `${v / 1000}k` : v}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 max-w-xs">
                  <Field label="Months a year your travel spend lands in" hint="1 = one big trip">
                    <NumInput prefix="" value={assum.tripMonths} step={1}
                      onChange={(v) => setAssum((a) => ({ ...a, tripMonths: Math.min(12, Math.max(1, v)) }))} />
                  </Field>
                  <p className="mt-1 text-[11px] text-stone-500 dark:text-zinc-500">
                    The yearly travel figures above are split evenly across this many months, and every
                    month is priced separately against each card's caps and minimum spends.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-[14px] font-semibold">Constraints and preferences</h3>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="Annual income" hint="eligibility check">
                    <NumInput value={profile.income} step={6000} onChange={(v) => setProfile((p) => ({ ...p, income: v }))} />
                  </Field>
                  <Field label="Annual fee ceiling" hint="per card">
                    <NumInput value={profile.maxFee} step={100} onChange={(v) => setProfile((p) => ({ ...p, maxFee: v }))} />
                  </Field>
                  <Field label="Lounge visits you'd use" hint="per year">
                    <NumInput prefix="" value={profile.loungeWanted} step={1} onChange={(v) => setProfile((p) => ({ ...p, loungeWanted: v }))} />
                  </Field>
                  <Field label="Trips flown" hint="per year">
                    <NumInput prefix="" value={profile.flights} step={1} onChange={(v) => setProfile((p) => ({ ...p, flights: v }))} />
                  </Field>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[{ k: "any", label: "Show everything" },
                    { k: "cash", label: "Cash redemption only" },
                    { k: "miles", label: "Miles-capable only" }].map((g) => (
                    <Toggle key={g.k} on={profile.goal === g.k} label={g.label}
                      onChange={() => setProfile((p) => ({ ...p, goal: g.k }))} />
                  ))}
                  <Toggle on={onlyEligible} onChange={setOnlyEligible}
                    label={onlyEligible ? "Hiding cards I can't get" : "Showing all income tiers"} />
                  <Toggle on={assum.includeSignup}
                    onChange={(v) => setAssum((a) => ({ ...a, includeSignup: v }))}
                    label={assum.includeSignup ? "Year-1 sign-up bonuses on" : "Sign-up bonuses off"} />
                </div>
                <label className="mt-3 flex items-center gap-2 text-[12px] text-stone-600 dark:text-zinc-400">
                  <input type="checkbox" checked={profile.paysInFull}
                    onChange={(e) => setProfile((p) => ({ ...p, paysInFull: e.target.checked }))}
                    className="h-4 w-4 accent-emerald-800 dark:accent-emerald-500" />
                  I pay my statement in full every month
                </label>
                {!profile.paysInFull && (
                  <p className="mt-3 rounded border border-rose-200 bg-rose-50 p-2 text-[12px] text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400">
                    Carrying a balance at 15% to 18% a year swamps every reward modelled here.
                    Choose on interest rate instead and ignore this ranking.
                  </p>
                )}
              </div>
            </section>
          )}

          {/* ===== RANKING ===== */}
          {tab === "rank" && (
            <section className="space-y-3">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-[17px] font-semibold">
                  Ranked by {assum.includeSignup ? "year-one" : "steady-state"} net value
                </h2>
                <span className="text-[12px] text-stone-500 dark:text-zinc-500">{ranked.length} cards</span>
              </div>
              <div className="flex flex-wrap gap-3 text-[11px] text-stone-600 dark:text-zinc-400">
                <span className="flex items-center gap-1.5"><i className="h-2 w-4 rounded-sm bg-emerald-700 dark:bg-emerald-600" /> Rewards</span>
                <span className="flex items-center gap-1.5"><i className="h-2 w-4 rounded-sm bg-sky-600" /> Lounge and insurance</span>
                <span className="flex items-center gap-1.5"><i className="h-2 w-4 rounded-sm bg-rose-400 dark:bg-rose-500" /> Fees, tax and FX</span>
              </div>

              <div className="space-y-2">
                {ranked.map((e, i) => {
                  const open = expanded === e.card.id;
                  const shown = assum.includeSignup ? e.netY1 : e.net;
                  return (
                    <article key={e.card.id} className="overflow-hidden rounded-lg border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                      <button onClick={() => setExpanded(open ? null : e.card.id)}
                        className="flex w-full items-start gap-3 p-3 text-left hover:bg-stone-50 dark:hover:bg-zinc-800/50">
                        <span className="mt-0.5 w-6 shrink-0 text-[13px] font-semibold tabular-nums text-stone-400 dark:text-zinc-500">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-2">
                            <span className="text-[13px] font-semibold">{e.card.bank}</span>
                            <span className="text-[13px] text-stone-700 dark:text-zinc-300">{e.card.name}</span>
                          </div>
                          <div className="mt-0.5 text-[11px] text-stone-500 dark:text-zinc-500">
                            {e.card.net} · Best route: {e.best.label}
                            {e.mpr > 0.001 && ` · ${fmt(e.mpr)} miles per ringgit`}
                          </div>
                          <div className="mt-2 max-w-md"><ValueBar e={e} /></div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            <SourceBadge conv={e.conv} />
                            {e.flags.map((f, k) => (
                              <span key={k} className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-800 dark:bg-amber-950/50 dark:text-amber-400">{f}</span>
                            ))}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className={`text-[15px] font-semibold tabular-nums ${shown >= 0 ? "text-emerald-800 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}>
                            {rm(shown)}
                          </div>
                          <div className="text-[10px] text-stone-500 dark:text-zinc-500">
                            {assum.includeSignup ? "year one" : "net per year"}
                          </div>
                          <div className="mt-1 flex justify-end">
                            {open ? <ChevronDown size={14} className="text-stone-400 dark:text-zinc-500" /> : <ChevronRight size={14} className="text-stone-400 dark:text-zinc-500" />}
                          </div>
                        </div>
                      </button>

                      {open && (
                        <div className="border-t border-stone-200 bg-stone-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                          <div className="grid gap-4 lg:grid-cols-2">
                            <div>
                              <h4 className="text-[12px] font-semibold text-stone-700 dark:text-zinc-300">Where the value comes from</h4>
                              <table className="mt-2 w-full text-[12px]">
                                <tbody className="divide-y divide-stone-200 dark:divide-zinc-800">
                                  <tr><td className="py-1">Cashback</td><td className="py-1 text-right tabular-nums">{rm(e.cbYear)}</td></tr>
                                  <tr>
                                    <td className="py-1">
                                      Points value
                                      <div className="text-[10px] text-stone-400 dark:text-zinc-500">
                                        {fmt0(e.ptsEarned)} earned, {fmt0(e.ptsYear)} usable at {fmt4(e.pv)} per point
                                      </div>
                                    </td>
                                    <td className="py-1 text-right tabular-nums">{rm(e.ptsValue)}</td>
                                  </tr>
                                  <tr><td className="py-1">Lounge ({e.loungeUsed} visits)</td><td className="py-1 text-right tabular-nums">{rm(e.loungeValue)}</td></tr>
                                  <tr><td className="py-1">Travel insurance</td><td className="py-1 text-right tabular-nums">{rm(e.insValue)}</td></tr>
                                  <tr className="font-medium"><td className="py-1">Gross value</td><td className="py-1 text-right tabular-nums">{rm(e.gross)}</td></tr>
                                  <tr><td className="py-1 text-rose-700 dark:text-rose-400">Annual fee</td><td className="py-1 text-right tabular-nums text-rose-700 dark:text-rose-400">−{fmt(e.feeCharged)}</td></tr>
                                  <tr><td className="py-1 text-rose-700 dark:text-rose-400">Service tax</td><td className="py-1 text-right tabular-nums text-rose-700 dark:text-rose-400">−{fmt(e.tax)}</td></tr>
                                  <tr><td className="py-1 text-rose-700 dark:text-rose-400">FX markup ({fmt(e.card.fx)}%)</td><td className="py-1 text-right tabular-nums text-rose-700 dark:text-rose-400">−{fmt(e.fxCost)}</td></tr>
                                  <tr><td className="py-1 text-rose-700 dark:text-rose-400">Transfer fees ({e.blocksPerYear} transfers)</td><td className="py-1 text-right tabular-nums text-rose-700 dark:text-rose-400">−{fmt(e.convFee)}</td></tr>
                                  <tr className="border-t-2 border-stone-300 font-semibold dark:border-zinc-700">
                                    <td className="py-1.5">Steady-state net</td><td className="py-1.5 text-right tabular-nums">{rm(e.net)}</td>
                                  </tr>
                                  {e.card.signup?.value > 0 && (
                                    <tr className="text-emerald-800 dark:text-emerald-400">
                                      <td className="py-1">
                                        Year-one sign-up bonus
                                        <div className="text-[10px] text-stone-400 dark:text-zinc-500">{e.card.signup.desc}</div>
                                      </td>
                                      <td className="py-1 text-right tabular-nums">
                                        {assum.includeSignup ? `+${fmt(e.signupValue)}` : `(${fmt(e.card.signup.value)} excluded)`}
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                              <p className="mt-2 text-[11px] text-stone-500 dark:text-zinc-500">{e.waiverNote}</p>
                              {e.card.note && (
                                <p className="mt-2 rounded border border-stone-200 bg-white p-2 text-[11px] text-stone-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">{e.card.note}</p>
                              )}
                            </div>

                            <div className="space-y-3">
                              <div>
                                <h4 className="text-[12px] font-semibold text-stone-700 dark:text-zinc-300">Redemption routes on this card</h4>
                                <div className="mt-1 text-[10px] text-stone-400 dark:text-zinc-500">{e.conv.label}</div>
                                <table className="mt-1.5 w-full text-[11px]">
                                  <tbody className="divide-y divide-stone-100 dark:divide-zinc-800">
                                    {e.routes.map((r) => (
                                      <tr key={r.key} className={r.key === e.best.key ? "font-medium" : "text-stone-500 dark:text-zinc-500"}>
                                        <td className="py-1">
                                          {r.label}
                                          <div className="text-[10px] text-stone-400 dark:text-zinc-500">{r.detail}</div>
                                        </td>
                                        <td className="py-1 text-right tabular-nums">{fmt4(r.rm)} / pt</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                {e.conv.note && <p className="mt-1.5 text-[10px] text-stone-500 dark:text-zinc-500">{e.conv.note}</p>}
                                {e.conv.src?.startsWith("http") && (
                                  <a href={e.conv.src} target="_blank" rel="noreferrer"
                                    className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-emerald-800 hover:underline dark:text-emerald-400">
                                    Issuer schedule <ExternalLink size={9} />
                                  </a>
                                )}
                              </div>

                              <div>
                                <h4 className="text-[12px] font-semibold text-stone-700 dark:text-zinc-300">Category by category</h4>
                                <div className="mt-1.5 overflow-x-auto">
                                  <table className="w-full min-w-[280px] text-[11px]">
                                    <thead className="text-[10px] text-stone-500 dark:text-zinc-500">
                                      <tr className="border-b border-stone-200 dark:border-zinc-800">
                                        <th className="py-1 text-left font-medium">Category</th>
                                        <th className="py-1 text-right font-medium">Spend</th>
                                        <th className="py-1 text-right font-medium">Earns a year</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100 dark:divide-zinc-800">
                                      {e.perCat.map((pc) => (
                                        <tr key={pc.cat}>
                                          <td className="py-1">
                                            <div>{CATS.find((c) => c.key === pc.cat)?.label}</div>
                                            <div className="text-[10px] text-stone-400 dark:text-zinc-500">{pc.rule}</div>
                                          </td>
                                          <td className="py-1 text-right tabular-nums text-stone-500 dark:text-zinc-500">
                                            {fmt(pc.amt)}
                                            <span className="text-[9px] text-stone-400 dark:text-zinc-600">{pc.annual ? " /yr" : " /mo"}</span>
                                          </td>
                                          <td className={`py-1 text-right tabular-nums ${pc.value > 0 ? "" : "text-stone-300 dark:text-zinc-700"}`}>
                                            {fmt(pc.value)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                  <button onClick={() => toggleCompare(e.card.id)}
                                    className={`rounded border px-2.5 py-1 text-[11px] ${
                                      compare.includes(e.card.id) ? "border-emerald-800 bg-emerald-800 text-white dark:border-emerald-600 dark:bg-emerald-600"
                                        : "border-stone-300 text-stone-600 hover:border-stone-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500"}`}>
                                    {compare.includes(e.card.id) ? "In comparison" : "Add to comparison"}
                                  </button>
                                  <span className="text-[10px] text-stone-400 dark:text-zinc-500">Card terms checked {e.card.verified}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* ===== MULTI-YEAR ===== */}
          {tab === "years" && (
            <section className="space-y-4">
              <div>
                <h2 className="text-[17px] font-semibold">Cumulative value over {assum.horizon} years</h2>
                <p className="mt-1 max-w-[65ch] text-[13px] text-stone-600 dark:text-zinc-400">
                  Sign-up bonuses land once and never repeat. Rewards decay as programmes devalue.
                  Fees, tax and lounge value stay flat. Over a long hold, those three forces decide
                  the winner, and it is often not the card that wins year one.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Toggle on={assum.applyDeval} onChange={(v) => setAssum((a) => ({ ...a, applyDeval: v }))}
                  label={assum.applyDeval ? "Devaluation priced in" : "Devaluation ignored"} />
                <Toggle on={assum.includeSignup} onChange={(v) => setAssum((a) => ({ ...a, includeSignup: v }))}
                  label={assum.includeSignup ? "Sign-up bonuses in year 1" : "Sign-up bonuses excluded"} />
                {[3, 5, 10].map((h) => (
                  <Toggle key={h} on={assum.horizon === h} label={`${h} years`}
                    onChange={() => setAssum((a) => ({ ...a, horizon: h }))} />
                ))}
              </div>

              <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <CumulativeChart horizon={assum.horizon} dark={dark}
                  series={ranked.slice(0, 5).map((e) => ({
                    label: `${e.card.bank} ${e.card.name}`, years: e.years,
                  }))} />
              </div>

              <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-stone-200 text-[11px] text-stone-500 dark:border-zinc-800 dark:text-zinc-500">
                      <th className="sticky left-0 z-10 bg-white p-2 text-left font-medium dark:bg-zinc-900">Card</th>
                      <th className="p-2 text-right font-medium">Year 1</th>
                      <th className="p-2 text-right font-medium">Year {assum.horizon}</th>
                      <th className="p-2 text-right font-medium">Cumulative</th>
                      <th className="p-2 text-right font-medium">Deval rate</th>
                      <th className="p-2 text-left font-medium">Observed devaluation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-zinc-800">
                    {ranked.slice(0, 12).map((e) => (
                      <tr key={e.card.id}>
                        <td className="sticky left-0 z-10 bg-white p-2 dark:bg-zinc-900">
                          <div className="font-medium">{e.card.bank}</div>
                          <div className="text-stone-600 dark:text-zinc-400">{e.card.name}</div>
                        </td>
                        <td className="p-2 text-right tabular-nums">{fmt(e.years[0].net)}</td>
                        <td className="p-2 text-right tabular-nums">{fmt(e.years[e.years.length - 1].net)}</td>
                        <td className="p-2 text-right font-semibold tabular-nums">{fmt(e.years[e.years.length - 1].cum)}</td>
                        <td className="p-2 text-right tabular-nums text-stone-500 dark:text-zinc-500">{fmt(e.devalRate * 100)}%</td>
                        <td className="p-2 text-[11px] text-stone-500 dark:text-zinc-500">
                          {e.devalEvents.length ? e.devalEvents[0] : "No recorded event"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-[14px] font-semibold">Devaluation rates and where they come from</h3>
                <p className="mt-1 text-[12px] text-stone-600 dark:text-zinc-400">
                  Rates are annualised from dated events, not invented. Adjust any of them.
                </p>
                <div className="mt-3 space-y-2">
                  {Object.entries(DEVAL).filter(([k]) => k !== "_default").map(([k, d]) => (
                    <div key={k} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-stone-100 pb-2 dark:border-zinc-800">
                      <span className="text-[12px] font-medium">{CONV[k]?.label || k}</span>
                      <span className="text-[12px] tabular-nums text-rose-700 dark:text-rose-400">−{fmt(d.annual * 100)}% a year</span>
                      <span className="flex-1 text-[11px] text-stone-500 dark:text-zinc-500">{d.events[0] || ""}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ===== WALLET ===== */}
          {tab === "wallet" && (
            <section className="space-y-4">
              <div>
                <h2 className="text-[17px] font-semibold">Best combination of cards</h2>
                <p className="mt-1 max-w-[60ch] text-[13px] text-stone-600 dark:text-zinc-400">
                  Each category is routed to whichever card in the set pays most for it, after caps.
                  Fees are charged for every card you hold.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((n) => (
                  <Toggle key={n} on={walletSize === n} label={`${n} card${n > 1 ? "s" : ""}`} onChange={() => setWalletSize(n)} />
                ))}
              </div>

              {/* Partner lounge — only meaningful once there is a second card */}
              {walletSize >= 2 && (
                <div className="rounded-lg border border-sky-200 bg-sky-50/60 p-3 dark:border-sky-900 dark:bg-sky-950/30">
                  <div className="flex flex-wrap items-center gap-3">
                    <Toggle on={partner.on} onChange={(v) => setPartner((p) => ({ ...p, on: v }))}
                      label={partner.on ? "Partner flies with me" : "Just me"} />
                    {partner.on && (
                      <div className="w-32">
                        <Field label="Partner's visits" hint="per year">
                          <NumInput prefix="" value={partner.visits} step={1}
                            onChange={(v) => setPartner((p) => ({ ...p, visits: v }))} />
                        </Field>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 max-w-[65ch] text-[12px] text-stone-600 dark:text-zinc-400">
                    Turn this on and the second or third card is chosen partly to get your partner
                    into the lounge with you. It only spends a card slot on that when it has to:
                    if your main card carries a guest allowance, or shares its passes with a
                    supplementary cardholder, your partner walks in on your card for free.
                  </p>
                </div>
              )}

              {wallet && (
                <>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
                    <div className="text-[11px] text-emerald-800/70 dark:text-emerald-400/70">Combined net annual value</div>
                    <div className="text-[24px] font-semibold tabular-nums text-emerald-900 dark:text-emerald-300">{rm(wallet.total)}</div>
                    {bestCard && (
                      <div className="mt-1 text-[12px] text-emerald-800 dark:text-emerald-400">
                        {rm(wallet.total - bestCard.net)} more than the single best card
                      </div>
                    )}
                    <div className="mt-1 text-[11px] text-emerald-800/80 dark:text-emerald-400/80">
                      {rm(wallet.cardsNet)} from rewards after fees, plus {rm(wallet.perks.loungeValue)} of
                      lounge and {rm(wallet.perks.insValue)} of travel insurance, each counted once
                      across the wallet rather than once per card.
                    </div>
                  </div>

                  {/* Who gets into the lounge, and on which card */}
                  {(wallet.perks.yourCard || partner.on) && (
                    <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                      <h3 className="text-[13px] font-semibold">Lounge plan</h3>
                      <ul className="mt-2 space-y-1.5 text-[12px]">
                        {wallet.perks.yourCard ? (
                          <li className="flex items-start gap-1.5 text-stone-700 dark:text-zinc-300">
                            <Check size={12} className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-500" />
                            <span>
                              <strong>You:</strong> {wallet.perks.yourVisits} visit{wallet.perks.yourVisits === 1 ? "" : "s"} on
                              the {wallet.perks.yourCard.bank} {wallet.perks.yourCard.name}
                              {" "}({wallet.perks.yourCard.lounge.p}, {wallet.perks.yourCard.lounge.v} a year)
                            </span>
                          </li>
                        ) : (
                          <li className="text-stone-500 dark:text-zinc-500">No card in this wallet has lounge access.</li>
                        )}
                        {partner.on && wallet.perks.ridesAlong > 0 && (
                          <li className="flex items-start gap-1.5 text-stone-700 dark:text-zinc-300">
                            <Check size={12} className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-500" />
                            <span>
                              <strong>Partner:</strong> {wallet.perks.ridesAlong} visit{wallet.perks.ridesAlong === 1 ? "" : "s"} on
                              your own card — it {wallet.perks.yourCard.lounge.sup ? "shares its passes with the supplementary cardholder" : "includes a guest"},
                              so no second lounge card is needed for those.
                            </span>
                          </li>
                        )}
                        {partner.on && wallet.perks.partnerCard && (
                          <li className="flex items-start gap-1.5 text-stone-700 dark:text-zinc-300">
                            <Check size={12} className="mt-0.5 shrink-0 text-sky-600 dark:text-sky-400" />
                            <span>
                              <strong>Partner's card:</strong> put the {wallet.perks.partnerCard.bank}{" "}
                              {wallet.perks.partnerCard.name} in your partner's name — it carries
                              {" "}{wallet.perks.partnerCard.lounge.v} {wallet.perks.partnerCard.lounge.p} visits
                              a year of its own, covering the {wallet.perks.partnerVisits - wallet.perks.ridesAlong} visit
                              {wallet.perks.partnerVisits - wallet.perks.ridesAlong === 1 ? "" : "s"} your card can't.
                            </span>
                          </li>
                        )}
                        {partner.on && !wallet.perks.partnerCard && wallet.perks.ridesAlong < partner.visits && (
                          <li className="flex items-start gap-1.5 text-amber-800 dark:text-amber-400">
                            <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                            <span>
                              No second card in this wallet has lounge access, so {partner.visits - wallet.perks.ridesAlong} of
                              your partner's visits are uncovered. Try a 3-card wallet, or pay at the door.
                            </span>
                          </li>
                        )}
                        {wallet.perks.warning && (
                          <li className="flex items-start gap-1.5 text-amber-800 dark:text-amber-400">
                            <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                            <span>{wallet.perks.warning}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {wallet.detail.map((d) => {
                      const isYours = wallet.perks.yourCard?.id === d.card.id;
                      const isPartners = wallet.perks.partnerCard?.id === d.card.id;
                      return (
                        <div key={d.card.id} className="rounded-lg border border-stone-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                          <div className="text-[13px] font-semibold">{d.card.bank}</div>
                          <div className="text-[13px] text-stone-700 dark:text-zinc-300">{d.card.name}</div>
                          <div className="mt-2 text-[15px] font-semibold tabular-nums text-emerald-800 dark:text-emerald-400">{rm(d.net)}</div>
                          <div className="text-[10px] text-stone-400 dark:text-zinc-500">rewards after fees, perks counted separately</div>
                          {(isYours || isPartners) && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {isYours && (
                                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                                  Your lounge card
                                </span>
                              )}
                              {isPartners && (
                                <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] text-sky-800 dark:bg-sky-950/50 dark:text-sky-400">
                                  Partner's lounge card
                                </span>
                              )}
                            </div>
                          )}
                          <div className="mt-2 text-[11px] font-medium text-stone-500 dark:text-zinc-500">Put on this card</div>
                          <ul className="mt-1 space-y-0.5">
                            {d.assigned.length === 0 && (
                              <li className="text-[11px] text-stone-400 dark:text-zinc-600">
                                {isYours || isPartners
                                  ? "No spending — it earns its keep on lounge access alone"
                                  : "Nothing — drop this card"}
                              </li>
                            )}
                            {d.assigned.map((a) => (
                              <li key={a} className="flex items-start gap-1.5 text-[11px] text-stone-700 dark:text-zinc-300">
                                <Check size={11} className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-500" />{a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </section>
          )}

          {/* ===== COMPARE ===== */}
          {tab === "compare" && (
            <section className="space-y-4">
              <h2 className="text-[17px] font-semibold">Side by side</h2>
              {compare.length === 0 ? (
                <div className="rounded-lg border border-dashed border-stone-300 p-8 text-center dark:border-zinc-700">
                  <p className="text-[13px] text-stone-500 dark:text-zinc-500">
                    Nothing selected. Open a card in the ranking and choose "Add to comparison".
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="border-b border-stone-200 dark:border-zinc-800">
                        <th className="sticky left-0 z-10 bg-white p-2 text-left font-medium text-stone-500 dark:bg-zinc-900 dark:text-zinc-500">Attribute</th>
                        {compare.map((id) => {
                          const c = CARDS.find((x) => x.id === id);
                          return (
                            <th key={id} className="min-w-[160px] p-2 text-left align-top">
                              <div className="flex items-start justify-between gap-1">
                                <div>
                                  <div className="font-semibold">{c.bank}</div>
                                  <div className="font-normal text-stone-600 dark:text-zinc-400">{c.name}</div>
                                </div>
                                <button onClick={() => toggleCompare(id)} className="text-stone-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400"><X size={13} /></button>
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-zinc-800">
                      {[
                        ["Steady-state net value", (e) => rm(e.net)],
                        ["Year-one net value", (e) => rm(e.netY1)],
                        [`Cumulative over ${assum.horizon} years`, (e) => rm(e.years[e.years.length - 1].cum)],
                        ["Miles per ringgit", (e) => (e.mpr > 0 ? fmt(e.mpr) : "—")],
                        ["Best redemption route", (e) => e.best.label],
                        ["Value of one point", (e) => `RM ${fmt4(e.pv)}`],
                        ["Conversion ratio", (e) => e.best.detail || "—"],
                        ["Minimum transfer block", (e) => (e.conv.block ? `${fmt0(e.conv.block)} points` : "None")],
                        ["Transfer fee", (e) => rm(e.conv.fee || 0)],
                        ["Points expiry", (e) => (e.conv.expiry ? `${e.conv.expiry} months` : "None")],
                        ["Rate sourced to issuer", (e) => (e.conv.sourced ? `Yes, ${e.conv.srcDate}` : "No — verify")],
                        ["Devaluation priced in", (e) => `${fmt(e.devalRate * 100)}% a year`],
                        ["Annual fee charged", (e) => rm(e.feeCharged)],
                        ["Fee waiver", (e) => e.waiverNote],
                        ["FX markup", (e) => `${fmt(e.card.fx)}%`],
                        ["Minimum income", (e) => `RM ${fmt0(e.card.income)}`],
                        ["Lounge", (e) => (e.card.lounge ? `${e.card.lounge.p}, ${e.card.lounge.v} visits` : "—")],
                        ["Partner can come in", (e) => (!e.card.lounge ? "—"
                          : e.card.lounge.sup ? "Yes, passes shared with the supplementary card"
                          : e.card.lounge.g > 0 ? `Yes, ${e.card.lounge.g} guest a visit`
                          : "No, they need their own card")],
                        ["Travel insurance", (e) => (e.card.ins ? `RM ${fmt0(e.card.ins)}` : "—")],
                        ["Sign-up bonus", (e) => (e.card.signup?.value ? `${rm(e.card.signup.value)} after ${rm(e.card.signup.minSpend)}` : "—")],
                        ["Excluded from earning", (e) => (e.card.excl || []).map((k) => CATS.find((c) => c.key === k)?.label).join(", ") || "—"],
                      ].map(([label, fn]) => (
                        <tr key={label}>
                          <td className="sticky left-0 z-10 bg-white p-2 font-medium text-stone-600 dark:bg-zinc-900 dark:text-zinc-400">{label}</td>
                          {compare.map((id) => {
                            const e = evaluateCard(CARDS.find((x) => x.id === id), profile.spend, assum, profile, convOverrides);
                            return <td key={id} className="p-2 align-top tabular-nums">{fn(e)}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* ===== CARD DATABASE ===== */}
          {tab === "db" && (
            <section className="space-y-3">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-[17px] font-semibold">Card database</h2>
                <span className="text-[12px] text-stone-500 dark:text-zinc-500">{dbList.length} of {CARDS.length}</span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex flex-1 items-center gap-2 rounded-md border border-stone-300 bg-white px-2 dark:border-zinc-700 dark:bg-zinc-900">
                  <Search size={14} className="text-stone-400 dark:text-zinc-500" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search bank or card name" className="w-full py-2 text-[16px] sm:text-[13px] outline-none bg-transparent text-stone-900 dark:text-zinc-100" />
                </div>
                <select value={bankFilter} onChange={(e) => setBankFilter(e.target.value)}
                  className="rounded-md border border-stone-300 bg-white px-2 py-2 text-[13px] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
                  {banks.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {dbList.map((c) => {
                  const cv = { ...CONV[c.conv], ...(convOverrides[c.conv] || {}) };
                  return (
                    <div key={c.id} className="rounded-lg border border-stone-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold">{c.bank}</div>
                          <div className="text-[13px] text-stone-700 dark:text-zinc-300">{c.name}</div>
                          <div className="mt-0.5 text-[11px] text-stone-500 dark:text-zinc-500">{c.net}</div>
                        </div>
                        <button onClick={() => toggleCompare(c.id)}
                          className={`shrink-0 rounded border px-2 py-1 text-[11px] ${
                            compare.includes(c.id) ? "border-emerald-800 bg-emerald-800 text-white dark:border-emerald-600 dark:bg-emerald-600"
                              : "border-stone-300 text-stone-600 dark:border-zinc-700 dark:text-zinc-400"}`}>
                          {compare.includes(c.id) ? "Added" : "Compare"}
                        </button>
                      </div>
                      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                        <dt className="text-stone-500 dark:text-zinc-500">Annual fee</dt><dd className="text-right tabular-nums">RM {fmt(c.fee)}</dd>
                        <dt className="text-stone-500 dark:text-zinc-500">Waiver</dt>
                        <dd className="text-right">
                          {c.waiver.t === "lifetime" ? "For life" : c.waiver.t === "spend" ? `RM ${fmt0(c.waiver.v)} spend`
                            : c.waiver.t === "swipes" ? `${c.waiver.v} swipes` : "None"}
                        </dd>
                        <dt className="text-stone-500 dark:text-zinc-500">Min income</dt><dd className="text-right tabular-nums">RM {fmt0(c.income)}</dd>
                        <dt className="text-stone-500 dark:text-zinc-500">Base earn</dt>
                        <dd className="text-right tabular-nums">
                          {c.base.u === "cb" ? `${fmt(c.base.rate)}%` : `${fmt(c.base.rate)} pts/RM`}
                        </dd>
                        <dt className="text-stone-500 dark:text-zinc-500">FX markup</dt><dd className="text-right tabular-nums">{fmt(c.fx)}%</dd>
                        <dt className="text-stone-500 dark:text-zinc-500">Lounge</dt>
                        <dd className="text-right">
                          {c.lounge ? `${c.lounge.v} × ${c.lounge.p}` : "—"}
                          {c.lounge && (c.lounge.sup || c.lounge.g > 0) && (
                            <div className="text-[10px] text-sky-700 dark:text-sky-400">
                              {c.lounge.sup ? "partner shares passes" : "+1 guest"}
                            </div>
                          )}
                        </dd>
                        <dt className="text-stone-500 dark:text-zinc-500">Sign-up</dt>
                        <dd className="text-right tabular-nums">{c.signup?.value ? `RM ${fmt(c.signup.value)}` : "—"}</dd>
                      </dl>
                      {c.rules.length > 0 && (
                        <ul className="mt-2 space-y-0.5 border-t border-stone-100 pt-2 dark:border-zinc-800">
                          {c.rules.map((r, i) => (
                            <li key={i} className="text-[11px] text-stone-600 dark:text-zinc-400">
                              {r.label}
                              {r.cap != null && (
                                <span className="text-stone-400 dark:text-zinc-500"> · cap {r.u === "cb" ? `RM ${fmt(r.cap)}` : `${fmt0(r.cap)} pts`} a month</span>
                              )}
                              {r.min && <span className="text-stone-400 dark:text-zinc-500"> · needs RM {fmt0(r.min)} a month</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <SourceBadge conv={cv} />
                        <span className="text-[10px] text-stone-400 dark:text-zinc-500">{cv.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ===== VALUATION ===== */}
          {tab === "assum" && (
            <section className="space-y-4">
              <div>
                <h2 className="text-[17px] font-semibold">Valuation</h2>
                <p className="mt-1 max-w-[65ch] text-[13px] text-stone-600 dark:text-zinc-400">
                  Conversion ratios below come from issuer schedules where a green badge appears.
                  The only thing that cannot be looked up is what a mile is worth to you, because
                  that depends on the cabin you redeem. Derive it from a real booking rather than guessing.
                </p>
              </div>

              <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-[14px] font-semibold">Work out a mile's value from a redemption you'd actually make</h3>
                <p className="mt-1 text-[12px] text-stone-600 dark:text-zinc-400">
                  Find a flight you would genuinely book, then enter its cash price, its taxes and
                  surcharges, and the miles the airline is asking for.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <Field label="Miles required" hint="award chart">
                    <NumInput prefix="" value={redeem.miles} step={5000} onChange={(v) => setRedeem((r) => ({ ...r, miles: v }))} />
                  </Field>
                  <Field label="Cash price of that ticket">
                    <NumInput value={redeem.cash} step={100} onChange={(v) => setRedeem((r) => ({ ...r, cash: v }))} />
                  </Field>
                  <Field label="Taxes you still pay" hint="on the award">
                    <NumInput value={redeem.taxes} step={50} onChange={(v) => setRedeem((r) => ({ ...r, taxes: v }))} />
                  </Field>
                  <Field label="Programme">
                    <select value={redeem.ffp} onChange={(e) => setRedeem((r) => ({ ...r, ffp: e.target.value }))}
                      className="w-full rounded-md border border-stone-300 bg-white px-2 py-2 text-[14px] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
                      {Object.entries(FFP).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/40">
                  <div>
                    <div className="text-[11px] text-emerald-800/70 dark:text-emerald-400/70">Implied value of one {FFP[redeem.ffp].name}</div>
                    <div className="text-[18px] font-semibold tabular-nums text-emerald-900 dark:text-emerald-300">RM {fmt4(impliedMile)}</div>
                  </div>
                  <button onClick={() => setAssum((a) => ({ ...a, mile: { ...a.mile, [redeem.ffp]: Number(impliedMile.toFixed(4)) } }))}
                    className="rounded-md bg-emerald-800 px-3 py-2 text-[12px] text-white hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-700">
                    Use this for {FFP[redeem.ffp].name}
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-[14px] font-semibold">What one mile is worth to you</h3>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(FFP).map(([k, p]) => (
                    <div key={k} className="rounded border border-stone-200 p-2 dark:border-zinc-800">
                      <div className="text-[12px] font-medium">{p.name}</div>
                      <div className="text-[10px] text-stone-400 dark:text-zinc-500">{p.airline}</div>
                      <div className="mt-1.5">
                        <NumInput prefix="RM" step={0.005} value={assum.mile[k]}
                          onChange={(v) => setAssum((a) => ({ ...a, mile: { ...a.mile, [k]: v } }))} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-[14px] font-semibold">Conversion tables by card tier</h3>
                <p className="mt-1 text-[12px] text-stone-600 dark:text-zinc-400">
                  Points needed per 1,000 miles. Malaysian issuers price these by card tier, so a
                  Visa Infinite and a Platinum from the same bank convert at different rates.
                </p>
                <div className="mt-3 space-y-3">
                  {Object.entries(CONV).filter(([k]) => k !== "cashOnly").map(([k, base]) => {
                    const c = { ...base, ...(convOverrides[k] || {}) };
                    return (
                      <div key={k} className="rounded border border-stone-200 p-3 dark:border-zinc-800">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="text-[12px] font-medium">{c.label}</div>
                            <div className="mt-1"><SourceBadge conv={c} /></div>
                          </div>
                          {c.src?.startsWith("http") && (
                            <a href={c.src} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-emerald-800 hover:underline dark:text-emerald-400">
                              Source <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          <Field label="Points per RM1 cash">
                            <NumInput prefix="" step={50} value={c.cashPer1}
                              onChange={(v) => setConvField(k, "cashPer1", null, v)} />
                          </Field>
                          {Object.keys(FFP).filter((f) => c.ffp?.[f] !== undefined).map((f) => (
                            <Field key={f} label={`${FFP[f].name} per 1,000`}>
                              <NumInput prefix="" step={500} value={c.ffp[f]}
                                onChange={(v) => setConvField(k, null, f, v)} />
                            </Field>
                          ))}
                          <Field label="Minimum block" hint="points">
                            <NumInput prefix="" step={1000} value={c.block}
                              onChange={(v) => setConvField(k, "block", null, v)} />
                          </Field>
                          <Field label="Transfer fee">
                            <NumInput step={5} value={c.fee} onChange={(v) => setConvField(k, "fee", null, v)} />
                          </Field>
                        </div>
                        {c.note && <p className="mt-2 text-[11px] text-stone-500 dark:text-zinc-500">{c.note}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-[14px] font-semibold">Benefits and mechanics</h3>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="Value of a lounge visit" hint="what you'd otherwise pay">
                    <NumInput value={assum.loungeValue} step={10} onChange={(v) => setAssum((a) => ({ ...a, loungeValue: v }))} />
                  </Field>
                  <Field label="Value of travel insurance" hint="per year">
                    <NumInput value={assum.insValue} step={25} onChange={(v) => setAssum((a) => ({ ...a, insValue: v }))} />
                  </Field>
                  <Field label="Service tax per card" hint="statutory, per year">
                    <NumInput value={assum.serviceTax} step={5} onChange={(v) => setAssum((a) => ({ ...a, serviceTax: v }))} />
                  </Field>
                  <Field label="Weekend share of spend" hint="0 to 1">
                    <NumInput prefix="" value={assum.wkndShare} step={0.05}
                      onChange={(v) => setAssum((a) => ({ ...a, wkndShare: Math.min(1, v) }))} />
                  </Field>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Toggle on={assum.applyBlock} onChange={(v) => setAssum((a) => ({ ...a, applyBlock: v }))}
                    label={assum.applyBlock ? "Stranded points penalised" : "Stranded points ignored"} />
                  <Toggle on={assum.applyDeval} onChange={(v) => setAssum((a) => ({ ...a, applyDeval: v }))}
                    label={assum.applyDeval ? "Devaluation priced in" : "Devaluation ignored"} />
                  <Toggle on={assum.includeSignup} onChange={(v) => setAssum((a) => ({ ...a, includeSignup: v }))}
                    label={assum.includeSignup ? "Sign-up bonuses in year 1" : "Sign-up bonuses excluded"} />
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                <h3 className="flex items-center gap-2 text-[14px] font-semibold text-amber-900 dark:text-amber-400">
                  <AlertTriangle size={15} /> What this model still does not do
                </h3>
                <ul className="mt-2 space-y-1 text-[12px] leading-relaxed text-amber-900 dark:text-amber-400/90">
                  <li><strong>{DATA_NOTE}</strong></li>
                  <li>Interest charges are ignored. If you revolve a balance, none of this matters.</li>
                  <li>Annual travel spend is split evenly across your trip months. One RM12,000 trip and
                    two RM6,000 trips are treated the same once you set the same number of trip months.</li>
                  <li>Quarterly minimum-spend tiers, such as UOB One, are checked monthly instead.</li>
                  <li>Points pooling across cards from the same issuer is not modelled, which understates UOB in particular.</li>
                  <li>Wallet routing is a greedy search, so it finds a very good split, not a proven optimum.</li>
                  <li>Lounge programmes change constantly and several now require a minimum monthly spend
                    before each visit, which is not modelled. UOB also admits only one of its own cards
                    per visit from 1 September 2026.</li>
                  <li>Campaign transfer bonuses, which run frequently on Enrich, are not included.</li>
                  <li>Sign-up bonus values rotate constantly and are placeholders — overwrite them with the live offer.</li>
                  <li>Credit score / CTOS-CCRIS eligibility, cash-advance fees, late-payment APR and card cancellation
                    impact are not modelled — see the README for the full checklist to apply manually.</li>
                </ul>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ---------------- MOBILE NAV ---------------- */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-stone-200 bg-white md:hidden dark:border-zinc-800 dark:bg-zinc-950"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {TABS.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[9px] ${
              tab === t.k ? "text-emerald-800 dark:text-emerald-400" : "text-stone-500 dark:text-zinc-500"}`}>
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<CreditCardDashboard />);

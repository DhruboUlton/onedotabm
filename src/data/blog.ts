import { PublicBlogPost } from '@/types';

// =================================================================
// SEED BLOG POSTS
// The live blog reads published rows from `public.blog_posts`
// (authored in /admin/blog). These seeds render only while that
// table has no published posts, so /blog is never an empty page.
// Delete this file's entries once the CMS holds real content.
// =================================================================

export const seedBlogPosts: PublicBlogPost[] = [
  {
    slug: 'ads-work-website-does-not',
    title: 'Your Ads Work. Your Website Is Where the Money Leaks.',
    excerpt:
      'Most accounts we audit do not have a traffic problem. They have a landing problem: the ad promises one thing, the page answers something else, and the budget pays for the gap.',
    category: 'Strategy',
    tags: ['Conversion', 'Landing Pages', 'Meta Ads'],
    publishedAt: '2026-09-02',
    author: 'Dhrubo Duti Biswas',
    content: `## The gap nobody owns

Agencies are measured on clicks and cost per click. Web teams are measured on launch dates. Between the two sits the part that decides revenue: what happens in the eight seconds after the click. Nobody is paid to own it, so nobody does.

That gap is why an account can show a healthy cost per click and a poor cost per purchase at the same time. The traffic is fine. The page receiving it was written for a different visitor.

## Match the promise, in the same words

If the ad says **788 students enrolled this cycle**, the page headline should not say "Welcome to our learning platform". A visitor arrives holding one specific expectation. The first screen either confirms it or spends their attention re-explaining.

- Headline repeats the ad promise using the ad's own nouns.
- The first screen shows the offer and the price context, not the brand story.
- One primary action per page. Secondary links go below the fold.
- Proof sits next to the claim it supports, not on a separate testimonials page.

Message match is not a copywriting flourish. It is the cheapest conversion work available, because it changes nothing about the budget, the audience, or the build.

## Fix the objection, not the button colour

Drop-off concentrates where an unanswered question lives. For a course, it is usually outcome and instructor credibility. For a service, it is scope and price. For an e-commerce product, it is delivery and returns.

Read the checkout drop-off point, write down the question a visitor would ask there, and answer it on the page above that point. Slower than testing button variants, and the only version that compounds.

## Instrument before you optimise

You cannot fix a funnel you cannot see. \`ViewContent\`, \`InitiateCheckout\` and \`Purchase\` must fire accurately — server-side as well as in the browser — before any conclusion about creative or audience is trustworthy.

Half the "creative fatigue" diagnoses we review are tracking failures. The ads kept working; the reporting stopped.

## What to take away

1. Cost per click and cost per purchase fail for different reasons. Diagnose them separately.
2. Message match between ad and landing page is the cheapest conversion gain available.
3. Find the drop-off point, write the question a visitor asks there, answer it above that point.
4. Verify event tracking before judging creative performance.`,
  },
  {
    slug: 'meta-ads-account-structure-that-scales',
    title: 'A Meta Ads Account Structure That Survives Scaling',
    excerpt:
      'Budget increases expose structure. Accounts that scale cleanly separate prospecting from retargeting, keep learning phases intact, and change one variable at a time.',
    category: 'Marketing',
    tags: ['Meta Ads', 'Account Structure', 'Scaling'],
    publishedAt: '2026-08-18',
    author: 'Dhrubo Duti Biswas',
    content: `## Structure is a budgeting decision

An account structure is not an organisational preference. It decides where the algorithm is allowed to spend, how fast a campaign exits the learning phase, and whether a result can be attributed to a change you made.

Most accounts break at scale for one reason: prospecting and retargeting share a campaign, so warm-audience conversions make cold-audience performance look better than it is. Budget then flows toward an audience that was already going to buy.

## Three pools, separated on purpose

Keep cold, qualified and warm traffic in distinct campaigns with distinct budgets. Each pool answers a different question, so each deserves its own read.

- **Prospecting** — broad and interest-based cold audiences. Judged on cost per qualified action, not ROAS.
- **Qualification** — engaged viewers, page visitors, video watchers. Judged on progression rate to checkout.
- **Retargeting** — cart and checkout abandoners. Judged on recovered revenue, capped so it cannot eat the prospecting budget.

## Respect the learning phase

Every meaningful edit resets learning. Stacking three changes in one afternoon guarantees that the next week of data explains nothing.

Change one variable, wait for the conversion window to complete, then read. Budget shifts above roughly twenty percent count as a change.

## Creative volume beats creative perfection

At scale the limiting factor is usually the number of distinct angles in rotation, not the polish of any single asset. Three angles at production quality outperform one angle at agency quality.

Build a rotation where each asset argues a different objection: price, outcome, credibility, speed. When one fatigues, the pool still covers the objection.

## What to take away

1. Separate prospecting, qualification and retargeting so warm conversions stop flattering cold performance.
2. Judge each pool on its own metric instead of one blended ROAS number.
3. One change per read cycle. Budget moves above ~20% count as a change.
4. Rotate creative by objection, not by aesthetic variation.`,
  },
  {
    slug: 'conversion-api-what-it-actually-fixes',
    title: 'Conversion API: What It Actually Fixes (and What It Does Not)',
    excerpt:
      'Server-side events recover signal lost to browser restrictions. They do not repair bad event definitions, duplicate purchases, or an offer nobody wants.',
    category: 'Marketing',
    tags: ['Tracking', 'Conversion API', 'Attribution'],
    publishedAt: '2026-07-29',
    author: 'Dhrubo Duti Biswas',
    content: `## The problem it solves

Browser-side pixels lose events to ad blockers, tracking prevention and short cookie lifetimes. The purchase still happened; the platform never heard about it, so optimisation trains on an incomplete picture.

The Conversion API sends the same events from your server, where none of those restrictions apply. Match quality rises, the algorithm sees more of the outcomes it is optimising toward, and reported results move closer to the numbers in your own backend.

## What it does not solve

It is not a fix for a weak offer, mismatched targeting, or a checkout that asks for eleven fields. It also will not help if the events themselves are defined badly.

- A \`Purchase\` event fired on page load instead of on payment confirmation stays wrong, server-side or not.
- Without a shared event ID, browser and server events double-count.
- Missing customer parameters keep match quality low even with server events in place.

## Deployment order that avoids double counting

Send both browser and server events for the same action, with one stable event ID shared by both. The platform deduplicates on that ID. Verify in the events manager that deduplication is actually reported before trusting the numbers.

Then compare platform-reported purchases against your own database for a full week. A persistent gap means an event definition problem, not an attribution one.

## What to take away

1. Server-side events recover lost signal. They do not fix definitions, offers or checkout friction.
2. Share one event ID across browser and server events or you will double-count.
3. Reconcile platform purchases against your own database before drawing conclusions.`,
  },
  {
    slug: 'custom-web-app-or-another-tool',
    title: 'When to Build a Custom Web App Instead of Buying Another Tool',
    excerpt:
      'Subscriptions are cheaper than engineering until the month you are paying five of them to move the same data by hand. Here is the line we use.',
    category: 'Web Development',
    tags: ['Web Applications', 'Internal Tools', 'Build vs Buy'],
    publishedAt: '2026-07-08',
    author: 'Dhrubo Duti Biswas',
    content: `## Buy first. Genuinely.

For a standard need with a standard shape — email, invoicing, scheduling, storefront — an off-the-shelf product wins on day one and keeps winning. Custom software carries a permanent maintenance cost that a subscription hides for you.

Build only when the process you run is the thing that differentiates you, or when the tools you own refuse to talk to each other.

## Four signals that the line has been crossed

These are the patterns we look for during a systems audit. Two or more, and a custom build usually pays back inside a year.

- Someone on staff spends hours each week copying data between two tools.
- Your actual process needs a field or a status the tool cannot express, so the team encodes it in a naming convention.
- You pay for overlapping seats across several products to cover one workflow.
- Reporting requires exporting from three systems into a spreadsheet before anyone can answer a simple question.

## Scope the first version brutally

The first release should replace one workflow completely, not five workflows partially. A tool that handles the full path from lead to invoice for one team beats a broader system nobody trusts with real data.

Everything else stays where it is until the first workflow has been running unattended for a month.

## Own the data model, rent the rest

Custom does not mean building authentication, payments or email delivery from scratch. It means owning the data model and the workflow on top of managed services that already solve the hard, boring parts.

That keeps the surface you maintain small, which is the only thing that keeps a custom system alive after launch.

## What to take away

1. Default to buying. Build when the workflow is the differentiator or the tools will not integrate.
2. Manual data re-entry between systems is the clearest build signal.
3. Ship one complete workflow before widening scope.
4. Own the data model, rent authentication, payments and delivery.`,
  },
];

export function formatBlogDate(isoDate: string): string {
  const date = new Date(isoDate.length === 10 ? `${isoDate}T00:00:00Z` : isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

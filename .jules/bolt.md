## 2026-04-11 - Unused Large Data Fetches in Promise.all
**Learning:** The dashboard stats API fetched the entire `Purchases` collection and queried today's `Invoices` twice within a `Promise.all` block, despite the results being unused or redundant. This is a codebase-specific anti-pattern where data is over-fetched into memory just because it's convenient to add to an existing `Promise.all` array.
**Action:** Always review the variables destructured from `Promise.all` to ensure they are actually used, and check for duplicate queries that can be resolved by reusing variables.

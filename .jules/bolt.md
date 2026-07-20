
## 2024-11-20 - Backend In-Memory Aggregation Anti-Pattern
**Learning:** A significant performance anti-pattern exists in the backend where large collections (like purchases and invoices) are fetched into memory using `find()` and then aggregated using O(n²) nested loop iterations against another collection (like products).
**Action:** Always check array mapping and looping operations in backend route handlers. Pre-calculate aggregations into O(n) lookup hash maps keyed by reference IDs before iterating over the main collection.

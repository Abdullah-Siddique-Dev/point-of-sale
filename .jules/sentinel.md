
## 2024-05-20 - Exposing Password Hashes in API Responses
**Vulnerability:** The `/get-all` and `/` endpoints in `POS_cashier/Backend_POS/routes/users.js` were returning the full user object, which included hashed passwords.
**Learning:** Returning entire documents by default from MongoDB can accidentally leak sensitive fields if not explicitly excluded or if a custom Data Transfer Object (DTO) isn't used.
**Prevention:** Always use projection (e.g., Mongoose's `.select("-password")`) or map documents to specific output models before sending user data over an API to ensure sensitive information like passwords, tokens, and PII are stripped out.

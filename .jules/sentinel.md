## 2026-04-10 - Mass Assignment Privilege Escalation
**Vulnerability:** The `/api/auth/register` route allowed any user to specify their role via the request body, allowing them to create an admin account.
**Learning:** Due to how destructuring works in JS, any field that is unstructured and then passed to the constructor will be saved into the database, even if not intended.
**Prevention:** Hardcode roles and explicitly map specific request body fields instead of blindly taking what the client provides.

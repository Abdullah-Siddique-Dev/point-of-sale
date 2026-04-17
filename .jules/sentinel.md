
## 2024-05-24 - [NoSQL Injection in Update/Delete Endpoints]
**Vulnerability:** NoSQL injection via `req.body` parameters directly passed into Mongoose `findOneAndUpdate` and `findOneAndDelete` methods (e.g., `_id: req.body.categoryId`). An attacker could pass an object like `{"$ne": null}` to bypass targeting and affect the first document in the collection.
**Learning:** Raw request body fields should never be used directly in database queries without validation, especially for identifier fields (`_id`).
**Prevention:** Strictly validate the type of identifier fields (e.g., `typeof req.body.id === 'string'`) before executing the database query.

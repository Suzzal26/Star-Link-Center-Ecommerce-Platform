import jwt from "jsonwebtoken";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTE4NjEyMWVjNjI5YjAzYTk0ZThkZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0MzMxNzkyMywiZXhwIjoxNzQzOTIyNzIzfQ.aVPQG80Z7gpheOgt6zV1L3pLgRkWq_gptTjhBf2OYmo";

const decoded = jwt.decode(token);
console.log(decoded);

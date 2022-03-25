export const { MONGODB_URI, JWT_SECRET } = process.env;

if (!MONGODB_URI) {
  console.log('No mongo connection string. Set MONGODB_URI environment variable.');
  process.exit(1);
}

if (!JWT_SECRET) {
  console.log('No JWT secret string. Set JWT_SECRET environment variable.');
  process.exit(1);
}

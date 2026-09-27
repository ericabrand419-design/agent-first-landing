const crypto = require('crypto');
const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-deal-room-password.js "your-password"');
  process.exit(1);
}
const salt = crypto.randomBytes(18).toString('base64url');
const hash = crypto.pbkdf2Sync(password, salt, 160000, 32, 'sha256').toString('base64url');
console.log(JSON.stringify({ salt, hash }, null, 2));

// Lightweight test users for quick local testing without backend auth.
// These are only used by local/dev flows (e.g. GameOnline) and do NOT
// create real accounts on the auth-service database.

export const TEST_USERS = [
  {
    email: 'testplayer1@example.com',
    name: 'testplayer1',
    password: 'password1'
  },
  {
    email: 'testplayer2@example.com',
    name: 'testplayer2',
    password: 'password2'
  }
];

export function findTestUser(email: string, password: string) {
  return TEST_USERS.find(u => u.email === email && u.password === password) || null;
}

export default TEST_USERS;

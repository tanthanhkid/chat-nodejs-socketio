const { test } = require('node:test');
const assert = require('node:assert/strict');

// Import the pool so we can mock it
const { pool } = require('../src/config/database');
// Import the function under test
const { deleteOldMessages } = require('../src/services/dbService');

test('deleteOldMessages removes messages older than the specified days', async () => {
  const originalConnect = pool.connect;
  let capturedQuery;

  // Mock the connect method
  pool.connect = async () => ({
    query: async (text, params) => {
      capturedQuery = { text, params };
      return { rowCount: 3 };
    },
    release: () => {}
  });

  const deletedCount = await deleteOldMessages(7);

  assert.equal(deletedCount, 3);
  assert.equal(
    capturedQuery.text,
    "DELETE FROM messages WHERE timestamp < NOW() - ($1 || ' days')::interval"
  );
  assert.deepEqual(capturedQuery.params, [7]);

  // Restore original connect
  pool.connect = originalConnect;
});

import assert from "node:assert";
import test from "node:test";
import { getUserIds } from "../storage.mjs";

test("User count is correct", () => {
  assert.equal(getUserIds().length, 5);
});

test("User IDs are correct", () => {
  const expectedUserIds = ["1", "2", "3", "4", "5"];
  assert.deepEqual(getUserIds(), expectedUserIds);
});

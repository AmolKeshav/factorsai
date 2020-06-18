/**
 * Unit testing for string service module
 */

const assert = require("assert");
const StringService = require("./string.service");

describe("String Tests", () => {
  it("Should return the closeness value of two strings", () => {
    let string1 = "keshav", string2 = "amol keshav";
    let similarity = StringService.similarity(string1, string2);
    
    assert.strictEqual(similarity, 1);
  })
})
import Test from "../../src/index.js";

describe("Simple test", () => {
  it("should export a class", () => {
    var t = new Test();
    expect(t).toBeDefined();
  });
});

import Test from "../../src/index.js";

describe("Simple test", () => {
  it("should export a class", () => {
    let t = new Test();
    expect(t).toBeDefined();
  });
});

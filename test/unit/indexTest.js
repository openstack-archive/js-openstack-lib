import Test from "../../src/index";

const FetchMock = require('fetch-mock');

describe("Simple test", () => {

  afterEach(() => {
    FetchMock.reset();
  });

  it("should export a class", () => {
    let t = new Test();
    expect(t).toBeDefined();
  });

  it("should retrieve URL's", (done) => {
    FetchMock.get("http://example.com/", {
      status: 200,
      body: "This is a test"
    });

    let t = new Test();
    t.getUrl("http://example.com/")
      .then((response) => {
        return response.text();
      })
      .then((body) => {
        expect(body).toEqual("This is a test");
        done();
      });
  });
});

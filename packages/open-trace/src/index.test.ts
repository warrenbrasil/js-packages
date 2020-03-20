jest.disableAutomock();
import OpenTrace from "./";

jest.mock("./getOpenTracingEnvironmentVariables", () => ({
  getOpenTracingEnvironmentVariables: jest
    .fn()
    .mockReturnValue({ enabled: true })
}));
describe("OpenTrace", () => {
  it("should return an instance on get instance method", async function() {
    expect(OpenTrace).toBeDefined();
  });
});

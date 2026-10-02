import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders the game title", () => {
    expect(renderToStaticMarkup(<App />)).toContain("More Likely");
  });
});

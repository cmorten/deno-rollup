import { expect } from "../../test/deps.ts";
import { describe, it } from "../../test/mod.ts";
import { join } from "../../deps.ts";
import { getAliasName } from "./getAliasName.ts";

describe("getAliasName", () => {
  it("getAliasName: when passed a file path for a file with no extension: it should return the file name", () => {
    const fileName = "test-file";
    const directory = "./test-path/";
    const filePath = join(directory, fileName);

    expect(getAliasName(filePath)).toBe(fileName);
  });

  it("getAliasName: when passed a file path for a file with an extension: it should return the file name without the extension", () => {
    const fileNameBase = "test-file";
    const fileName = `${fileNameBase}.extension`;
    const directory = "./test-path/";
    const filePath = join(directory, fileName);

    expect(getAliasName(filePath)).toBe(fileNameBase);
  });
});

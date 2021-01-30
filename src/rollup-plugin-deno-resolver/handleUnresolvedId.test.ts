import type { RollupError } from "../../deps.ts";
import { expect } from "../../test/deps.ts";
import { describe, it } from "../../test/mod.ts";
import { handleUnresolvedId } from "./handleUnresolvedId.ts";

const mockId = "test-id";

describe("handleUnresolvedId", () => {
  it("handleUnresolvedId: when the importer is not undefined: it should return null", () => {
    expect(handleUnresolvedId(mockId, "test-importer")).toBeNull();
  });

  it("handleUnresolvedId: when the importer is undefined: it should thow an error with code 'UNRESOLVED_ENTRY' and a message regarding not being able to resolve the entry module", () => {
    let thrownError: RollupError;

    try {
      handleUnresolvedId(mockId);
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError!).toBeInstanceOf(Error);
    expect(thrownError!.code).toEqual("UNRESOLVED_ENTRY");
    expect(thrownError!.message).toEqual(
      `Could not resolve entry module (${mockId}).`,
    );
  });
});

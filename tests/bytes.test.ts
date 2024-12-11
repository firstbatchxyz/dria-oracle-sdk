import { Hex, stringToBytes } from "viem";
import { ArweaveStorage } from "../src";
import { contractBytesToStringWithStorage, stringToContractBytesWithStorage } from "../src/utils";

describe("bytes", () => {
  it("should convert hex encodings", async () => {
    const str64hex = "8c96da6c3f5534321a3d39566825196dd94581b4ef2f5b98fb8eb4e6bcae18a8";
    const bytes64hex =
      "0x38633936646136633366353533343332316133643339353636383235313936646439343538316234656632663562393866623865623465366263616531386138";
    expect(await stringToContractBytesWithStorage(str64hex)).toEqual(bytes64hex);
    expect(await contractBytesToStringWithStorage(bytes64hex)).toEqual(str64hex);
  });

  it("should convert strings to bytes and back", async () => {
    const strText = "Hello World";
    const bytesText = "0x48656c6c6f20576f726c64";
    expect(await stringToContractBytesWithStorage(strText)).toEqual(bytesText);
    expect(await contractBytesToStringWithStorage(bytesText)).toEqual(strText);
  });

  it("should download and parse data from Arweave", async () => {
    const key = JSON.stringify({ arweave: "jJbabD9VNDIaPTlWaCUZbdlFgbTvL1uY-4605ryuGKg" });
    const keyHex: Hex = `0x${Buffer.from(stringToBytes(key)).toString("hex")}`;
    const result = await contractBytesToStringWithStorage(keyHex, new ArweaveStorage());
    expect(result).toEqual('"Hello, Arweave!"');
  });
});

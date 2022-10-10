import type { BytesLike } from "ethers";
import { concat, Hexable, hexlify, zeroPad } from "ethers/lib/utils";


/**
 * Utility function that transforms a hexadecimal number from the output of the ITier contract report
 * @param report String with Hexadecimal containing the array data
 * @returns number[] Block array of the reports
 */

export function formatAddress(address) {
  let formatted =
    address.slice(0, 6) +
    "..." +
    address.slice(address.length - 4, address.length);
  return formatted;
}

export function formatAddressExtended(address) {
  let formatted =
    address.slice(0, 10) +
    "..." +
    address.slice(address.length - 10, address.length);
  return formatted;
}

export const validateFields = async (fields: any[]) => {

  let fieldValues: any = {};
  const validations = await Promise.all(Object.keys(fields).map(async (key) => {
    const validationResult = await fields[key].validate();
    fieldValues[key] = validationResult.value;
    return validationResult;
  }));
  return {
    validationResult: validations.every((validation) => validation.ok),
    fieldValues,
  };
};

export function tierRange(startTier: number, endTier: number): number {
  //   op_.val & 0x0f, //     00001111
  //   op_.val & 0xf0, //     11110000

  if (startTier < 0 || startTier > 8) {
    throw new Error(`Invalid startTier ${startTier}`);
  } else if (endTier < 0 || endTier > 8) {
    throw new Error(`Invalid endTier ${endTier}`);
  }
  let range = endTier;
  range <<= 4;
  range += startTier;
  return range;
}

/**
 * Converts an opcode and operand to bytes, and returns their concatenation.
 * @param code - the opcode
 * @param erand - the operand, currently limited to 1 byte (defaults to 0)
 */
export function op(code: number, erand = 0): Uint8Array {
  return concat([bytify(code), bytify(erand)]);
}

/**
 * Converts a value to raw bytes representation. Assumes `value` is less than or equal to 1 byte, unless a desired `bytesLength` is specified.
 *
 * @param value - value to convert to raw bytes format
 * @param bytesLength - (defaults to 1) number of bytes to left pad if `value` doesn't completely fill the desired amount of memory. Will throw `InvalidArgument` error if value already exceeds bytes length.
 * @returns {Uint8Array} - raw bytes representation
 */
export function bytify(
  value: number | BytesLike | Hexable,
  bytesLength = 1
): BytesLike {
  return zeroPad(hexlify(value), bytesLength);
}

export const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text)
}



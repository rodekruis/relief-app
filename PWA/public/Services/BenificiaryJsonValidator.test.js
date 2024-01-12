import { describe, test, expect } from '@jest/globals';
import { BenificiaryJsonValidator } from './BenificiaryJsonValidator';
describe('BenificiaryJsonValidator', () => {
    let sut = BenificiaryJsonValidator;
    test("json is invalid when not providing code", () => {
        expect(sut.isValidBenificiaryJson([
            ["codeMissing", "firstName", "lastName"],
            ["123", "Steve", "Jobs"]
        ])).toBe(false);
    });
    test("json is  valid when providing code", () => {
        expect(sut.isValidBenificiaryJson([
            ["code", "firstName", "lastName"],
            ["123", "Steve", "Jobs"]
        ])).toBe(true);
    });
});

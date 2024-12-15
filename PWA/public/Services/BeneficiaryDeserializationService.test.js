import { describe, test, expect } from '@jest/globals';
import { BeneficiaryDeserializationService } from './BeneficiaryDeserializationService';
import { fail } from 'assert';
describe('BeneficiaryDeserializationService', () => {
    const distributionName = "distributionName";
    const sut = new BeneficiaryDeserializationService();
    const validJson = [
        {
            "code": "3700476611447",
            "name": "Jacopo",
            "surname": "Margutti",
            "gender": "Male"
        },
        {
            "code": "8710400392279",
            "name": "Susan",
            "surname": "Ellis",
            "gender": "Female"
        }
    ];
    const invalidJsonBecauseOfMissingCode = [
        {
            "name": "Jacopo",
            "surname": "Margutti",
            "gender": "Male"
        },
        {
            "code": "8710400392279",
            "name": "Susan",
            "surname": "Ellis",
            "gender": "Female"
        }
    ];
    test("When deserializing valid json, then all codes are correct", () => {
        const results = sut.deserializeJson(validJson, distributionName);
        expect(results[0].code).toBe("3700476611447");
        expect(results[1].code).toBe("8710400392279");
    });
    test("When deserializing valid json, then distributionName is correct", () => {
        const results = sut.deserializeJson(validJson, distributionName);
        expect(results[0].distributionName).toBe(distributionName);
        expect(results[1].distributionName).toBe(distributionName);
    });
    test("When deserializing valid json, then default values are correct", () => {
        const results = sut.deserializeJson(validJson, distributionName);
        expect(results[0].hasBeenMarkedAsReceived).toBe(false);
        expect(results[1].hasBeenMarkedAsReceived).toBe(false);
        expect(results[0].dateReceived).toBe(undefined);
        expect(results[1].dateReceived).toBe(undefined);
    });
    test("When deserializing valid json, then all columns are correct", () => {
        const results = sut.deserializeJson(validJson, distributionName);
        expect(results[0].columns).toStrictEqual(["code", "name", "surname", "gender"]);
        expect(results[1].columns).toStrictEqual(["code", "name", "surname", "gender"]);
    });
    test("When deserializing valid json, then all values are correct", () => {
        const results = sut.deserializeJson(validJson, distributionName);
        expect(results[0].values).toStrictEqual(["3700476611447", "Jacopo", "Margutti", "Male"]);
        expect(results[1].values).toStrictEqual(["8710400392279", "Susan", "Ellis", "Female"]);
    });
    test("When deserializing json with missing code, then correct error is thrown", () => {
        try {
            const results = sut.deserializeJson(invalidJsonBecauseOfMissingCode, distributionName);
            fail("Should have thown error");
        }
        catch (error) {
            expect(error).toEqual(Error("Expected beneficiary code"));
        }
    });
});

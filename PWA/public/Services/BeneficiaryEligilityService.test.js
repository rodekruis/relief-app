import { describe, test } from '@jest/globals';
import { BeneficiaryEligilityService } from "./BeneficiaryEligilityService";
import { Database } from "./Database";
import { indexedDB } from "fake-indexeddb";
import { ActiveSession } from '../SessionState/ActiveSession';
describe('BeneficiaryEligilityService', () => {
    const eligibleBeneficiaryCode = "ValidCode";
    const ineligibleBeneficiaryCode = "InvalidCode";
    const database = new Database(indexedDB);
    const activeSession = new ActiveSession(database);
    const sut = new BeneficiaryEligilityService(activeSession);
    test("TODO: add", () => {
        // expect(
        //     "implemented"   
        // ).toBe("true")
    });
});

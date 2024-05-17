import { describe, test, expect } from "@jest/globals";
import { BeneficiaryEligilityService } from "./BeneficiaryEligilityService";
import { Database } from "./Database";
import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { ActiveSession } from "./ActiveSession";
import { Distribution } from "../Models/Distribution";
import { Beneficiary } from "../Models/Beneficiary";
import { fail } from "assert";
const activeEligibleBeneficiaryCode = "1234AA";
const inActiveEligibleBeneficiaryCode = "5432";
const eligibleActiveDistributionBeneficiary = new Beneficiary(activeEligibleBeneficiaryCode, ["code", "name"], [activeEligibleBeneficiaryCode, "henry"]);
const eligibleInactiveDistributionBeneficiary = new Beneficiary(activeEligibleBeneficiaryCode, ["code", "name"], [inActiveEligibleBeneficiaryCode, "tedd"]);
const activeDistribution = new Distribution("items", "date", "place", "activeDistribution");
const inactiveDistribution = new Distribution("items", "date", "place", "inactiveDistribution");
async function setupDatabase() {
    const database = new Database(new IDBFactory());
    await database.addDistribution(activeDistribution);
    await database.addDistribution(inactiveDistribution);
    await database.addBeneficiaryToDistribution(eligibleActiveDistributionBeneficiary, activeDistribution);
    await database.addBeneficiaryToDistribution(eligibleInactiveDistributionBeneficiary, inactiveDistribution);
    return database;
}
describe("BeneficiaryEligilityService", () => {
    test("When checking elible code from inactive distribution during active distrubution Then not eligible", async () => {
        const activeSession = await new ActiveSession(await setupDatabase());
        activeSession.nameOfLastViewedDistribution = activeDistribution.distrib_name;
        const sut = new BeneficiaryEligilityService(activeSession);
        expect(await sut.isBenificiaryEligibleForCurrentDistribution(inActiveEligibleBeneficiaryCode)).toEqual(false);
    });
    test("When checking elible code from active distribution during active distrubtion Then eligible", async () => {
        const activeSession = await new ActiveSession(await setupDatabase());
        activeSession.nameOfLastViewedDistribution = activeDistribution.distrib_name;
        const sut = new BeneficiaryEligilityService(activeSession);
        expect(await sut.isBenificiaryEligibleForCurrentDistribution(activeEligibleBeneficiaryCode)).toEqual(true);
    });
    test("When checking code from any distribution during inactive distrubtion Then error is thrown", async () => {
        const activeSession = await new ActiveSession(await setupDatabase());
        activeSession.nameOfLastViewedDistribution = undefined;
        const sut = new BeneficiaryEligilityService(activeSession);
        try {
            const result = await sut.isBenificiaryEligibleForCurrentDistribution("could have been any code");
            fail("Expected error");
        }
        catch (error) {
            expect(error).toEqual(Error("Expected active distribution"));
        }
    });
});

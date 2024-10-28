import { describe, test, expect } from '@jest/globals';
import { Database } from "./Database";
import { Distribution } from '../Models/Distribution';
import { indexedDB } from "fake-indexeddb";
import { Beneficiary } from '../Models/Beneficiary';
describe('Database', () => {
    const sut = new Database(indexedDB);
    const distributionName = "UniqueDistributionName";
    const distribution = new Distribution("items", "date", "location", distributionName);
    const beneficiaryCode = "123";
    const beneficiary2Code = "1234";
    const beneficiary = new Beneficiary(beneficiaryCode, ["code"], [beneficiaryCode], distributionName);
    const beneficiary2 = new Beneficiary(beneficiary2Code, ["code"], [beneficiaryCode], distributionName);
    test("When adding distribution, it can be retrieved", async () => {
        await sut.addDistribution(distribution);
        const receivedDistribution = await sut.distributionWithName(distributionName);
        expect(receivedDistribution.distrib_name).toEqual(distributionName);
    });
    test("When same distribution is added again, constaint error is thown", async () => {
        try {
            await sut.addDistribution(distribution);
            throw new Error("Expected other error to be thown");
        }
        catch (error) {
            expect(error.name).toEqual("ConstraintError");
        }
    });
    test("When adding a beneficiary, it can be retrieved", async () => {
        await sut.addBeneficiary(beneficiary);
        const receivedBeneficiary = await sut.beneficiaryWithCode(beneficiaryCode, distributionName);
        expect(receivedBeneficiary.code).toEqual(beneficiaryCode);
    });
    test("When marking a benefificiary as marked, it shows as marked", async () => {
        await sut.addBeneficiary(beneficiary2);
        var receivedBeneficiaries = await sut.beneficiariesForDistributionNamed(distributionName);
        expect(receivedBeneficiaries.length).toEqual(2);
        expect(receivedBeneficiaries[0].hasBeenMarkedAsReceived).toEqual(false);
        expect(receivedBeneficiaries[1].hasBeenMarkedAsReceived).toEqual(false);
        await sut.markBeneficiaryAsReceived(beneficiary2.code, distribution.distrib_name);
        var receivedBeneficiaries = await sut.beneficiariesForDistributionNamed(distributionName);
        expect(receivedBeneficiaries[0].hasBeenMarkedAsReceived).toEqual(false);
        expect(receivedBeneficiaries[1].hasBeenMarkedAsReceived).toEqual(true);
        await sut.markBeneficiaryAsReceived(beneficiary.code, distribution.distrib_name);
        var receivedBeneficiaries = await sut.beneficiariesForDistributionNamed(distributionName);
        console.log(receivedBeneficiaries);
        expect(receivedBeneficiaries[0].hasBeenMarkedAsReceived).toEqual(true);
        expect(receivedBeneficiaries[1].hasBeenMarkedAsReceived).toEqual(true);
    });
});

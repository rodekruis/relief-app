import { describe, test, expect } from '@jest/globals';
import { Database } from "./Database";
import { Distribution } from '../Models/Distribution';
import { indexedDB } from "fake-indexeddb";
import { Beneficiary } from '../Models/Beneficiary';
describe('Database', () => {
    const sut = new Database(indexedDB);
    const distributionName = "UniqueDistributionName";
    const distribution = new Distribution("items", "date", "location", distributionName);
    const beneficiary = new Beneficiary("123", ["code"], ["123"]);
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
    // test("When adding beneficiary to distribution, it can be retrieved", async () => {
    //     await sut.addDistribution(distribution)
    //     await sut.addBeneficiaryToDistribution(beneficiary, distribution)
    //     const receivedDistribution: any = await sut.distributionWithName(distributionName)
    //     expect(
    //         sut.benificiariesForDistribution(distribution)
    //     ).toStrictEqual([beneficiary])
    // })
});

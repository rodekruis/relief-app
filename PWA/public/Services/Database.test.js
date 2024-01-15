import { describe, test, expect } from '@jest/globals';
import { Database } from "./Database";
import { Distribution } from '../Models/Distribution';
import { indexedDB } from "fake-indexeddb";
describe('BeneficiaryEligilityService', () => {
    const sut = new Database(indexedDB);
    const distributionName = "UniqueDistributionName";
    const distribution = new Distribution("items", "date", "location", distributionName);
    test("Added distribution can be retrieved", async () => {
        await sut.addDistribution(distribution);
        const receivedDistribution = await sut.distributionWithName(distributionName);
        console.log(receivedDistribution);
        expect(receivedDistribution.distrib_name).toEqual(distributionName);
    });
    test(`Added distributionBeneficiaries can be retrieved`, async () => {
        // await sut.addBeneficiaryToDistribution()
    });
});

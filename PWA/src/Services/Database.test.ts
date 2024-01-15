import {describe, test, expect, it} from '@jest/globals'
import { Database } from "./Database";
import { Distribution } from '../Models/Distribution';
import { indexedDB } from "fake-indexeddb"

describe('BeneficiaryEligilityService', () => {
    const sut = new Database(indexedDB)

    test("Added distribution can be retrieved", async () => {
        const distributionName = "UniqueDistributionName"
        const distribution = new Distribution("items", "date", "location", distributionName)

        await sut.addDistribution(distribution)
        const receivedDistribution: any = await sut.distributionWithName(distributionName)
        console.log(receivedDistribution)
        expect(
            receivedDistribution.distrib_name
        ).toEqual(distributionName)
    })
 });
import {describe, test, expect, it} from '@jest/globals'
import { Database } from "./Database";
import { Distribution } from '../Models/Distribution';
import { indexedDB } from "fake-indexeddb"
import { Beneficiary } from '../Models/Beneficiary';

describe('Database', () => {
    const sut = new Database(indexedDB)
    const distributionName = "UniqueDistributionName"
    const distribution = new Distribution("items", "date", "location", distributionName)
    const beneficiary = new Beneficiary("123", ["code"], ["123"])

    test("When adding distribution, it can be retrieved", async () => {
        await sut.addDistribution(distribution)
        const receivedDistribution: any = await sut.distributionWithName(distributionName)
        expect(
            receivedDistribution.distrib_name
        ).toEqual(distributionName)
    })

    test("When adding beneficiary to distribution, it can be retrieved", async () => {
        await sut.addDistribution(distribution)
        await sut.addBeneficiaryToDistribution(beneficiary, distribution)
        const receivedDistribution: any = await sut.distributionWithName(distributionName)
        expect(
            sut.benificiariesForDistribution(distribution)
        ).toStrictEqual([beneficiary])
    })
 });
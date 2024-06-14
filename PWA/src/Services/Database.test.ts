import {describe, test, expect, it} from '@jest/globals'
import { Database } from "./Database";
import { Distribution } from '../Models/Distribution';
import { indexedDB } from "fake-indexeddb"
import { Beneficiary } from '../Models/Beneficiary';
import { DistributionBeneficiary } from '../Models/DistributionBeneficiary';

describe('Database', () => {
    const sut = new Database(indexedDB)
    const distributionName = "UniqueDistributionName"
    const distribution = new Distribution("items", "date", "location", distributionName)
    const beneficiaryCode = "123"
    const beneficiary = new Beneficiary(beneficiaryCode, ["code"], [beneficiaryCode])

    test("When adding distribution, it can be retrieved", async () => {
        await sut.addDistribution(distribution)
        const receivedDistribution: any = await sut.distributionWithName(distributionName)
        expect(
            receivedDistribution.distrib_name
        ).toEqual(distributionName)
    })

    test("When same distribution is added again, constaint error is thown", async () => {
        try {
            await sut.addDistribution(distribution)
            throw new Error("Expected other error to be thown")
        } catch (error: any) {
            expect(
                error.name
            ).toEqual("ConstraintError")
        }
    })

    test("When adding a beneficiary, it can be retrieved", async () => {
        await sut.addBenificiary(beneficiary)
        const receivedBeneficiary: any = await sut.beneficiaryWithCode(beneficiaryCode)
        expect(
            receivedBeneficiary.code
        ).toEqual(beneficiaryCode)
    })

    test("When adding beneficiary to distribution, it can be retrieved", async () => {
        await sut.addBeneficiaryToDistribution(beneficiary, distribution)
        const receivedBeneficiaries: DistributionBeneficiary[] = await sut.benificiariesForDistribution(distribution)
        expect(
            receivedBeneficiaries.length
        ).toEqual(1)

        expect(
            receivedBeneficiaries[0].beneficiaryCode
        ).toEqual(beneficiary.code)

        expect(
            receivedBeneficiaries[0].distributionName
        ).toEqual(distribution.distrib_name)
    })

    test("When adding beneficiary to distribution twice, an error is thown", async () => {
        try {
            await sut.addBeneficiaryToDistribution(beneficiary, distribution)
            throw Error("expected error to be thown at this point")
        } catch(error: any) {
            expect(error.message).toBe("Beneficiary was already added to distribution")
        }
    })

    test("When setting an active distribution, they can be retrieved", async () => {
        const distribution = new Distribution("12", "123", "Arnhem", "Name")
        try {
            await sut.setActiveDistribution(distribution)
            const result = await sut.getActiveDistributions()
            expect(result[0].distrib_name).toBe(distribution.distrib_name)
            expect(result.length).toBe(1)
        } catch(error: any) {
            expect(error.message).toBe("Empty")
        }
    })

    test("When setting an active distribution, it can be retrieved", async () => {
        const distribution = new Distribution("12", "123", "Arnhem", "Name")
        try {
            await sut.setActiveDistribution(distribution)
            const result = await sut.getActiveDistribution()
            expect(result.distrib_name).toBe(distribution.distrib_name)
        } catch(error: any) {
            expect(error.message).toBe("Empty")
        }
    })
 });
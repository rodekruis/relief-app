import {describe, test, expect } from '@jest/globals'
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
    const beneficiary2Code = "1234"
    const beneficiary = new Beneficiary(beneficiaryCode, ["code"], [beneficiaryCode])
    const beneficiary2 = new Beneficiary(beneficiary2Code, ["code"], [beneficiaryCode])

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
        await sut.addBeneficiary(beneficiary)
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
            expect(error.message).toBe("Beneficiary with code 123 was already added to distribution named UniqueDistributionName")
        }
    })

    test("When marking a benefificiary as marked, it shows as marked", async () => {
        await sut.addBeneficiaryToDistribution(beneficiary2, distribution)
        var receivedBeneficiaries: DistributionBeneficiary[] = await sut.benificiariesForDistribution(distribution)
        expect(
            receivedBeneficiaries.length
        ).toEqual(2)

        expect(
            receivedBeneficiaries[0].hasBeenMarkedAsReceived
        ).toEqual(false)
        expect(
            receivedBeneficiaries[1].hasBeenMarkedAsReceived
        ).toEqual(false)

        await sut.markBeneficiaryAsReceived(beneficiary2.code, distribution.distrib_name)

        var receivedBeneficiaries: DistributionBeneficiary[] = await sut.benificiariesForDistribution(distribution)
        expect(
            receivedBeneficiaries[0].hasBeenMarkedAsReceived
        ).toEqual(false)
        expect(
            receivedBeneficiaries[1].hasBeenMarkedAsReceived
        ).toEqual(true)

        await sut.markBeneficiaryAsReceived(beneficiary.code, distribution.distrib_name)

        var receivedBeneficiaries: DistributionBeneficiary[] = await sut.benificiariesForDistribution(distribution)
        console.log(receivedBeneficiaries)
        expect(
            receivedBeneficiaries[0].hasBeenMarkedAsReceived
        ).toEqual(true)
        expect(
            receivedBeneficiaries[1].hasBeenMarkedAsReceived
        ).toEqual(true)
    })
 });
import { describe, test, expect, beforeEach } from '@jest/globals';
import { fail } from 'assert';
import { BeneficiariesService } from './BeneficiariesService.js';
import { IDBFactory } from "fake-indexeddb";
import { ActiveSession } from './ActiveSession.js';
import { Database } from './Database.js';
import { Distribution } from '../Models/Distribution.js';
import { Beneficiary } from '../Models/Beneficiary';
describe('BeneficiariesService', () => {
    const existingDistributionName = "ExistingDistributionName";
    const beneficiaryCode1 = "code1";
    const beneficiaryCode2 = "code2";
    const existingDistribution = new Distribution("", "", "", existingDistributionName);
    const beneficiary1 = new Beneficiary(beneficiaryCode1, [], []);
    const beneficiary2 = new Beneficiary(beneficiaryCode2, [], []);
    var database = new Database(new IDBFactory());
    var activeSesion = new ActiveSession(database);
    var sut = new BeneficiariesService(activeSesion);
    beforeEach(() => {
        database = new Database(new IDBFactory());
        activeSesion = new ActiveSession(database);
        sut = new BeneficiariesService(activeSesion);
    });
    test("When there's no active distribution Then error is thrown", async () => {
        activeSesion.nameOfLastViewedDistribution = undefined;
        try {
            const beneficiaries = await sut.beneficiariesForActiveDistribution();
            fail("expected other error to be thrown at this point");
        }
        catch (error) {
            expect(error).toEqual("Expected active distribution name");
        }
    });
    test("When active distribution doesn't exist Then error is thrown", async () => {
        activeSesion.nameOfLastViewedDistribution = "Nonexisting distribution name";
        try {
            const beneficiaries = await sut.beneficiariesForActiveDistribution();
            fail("expected other error to be thrown at this point");
        }
        catch (error) {
            expect(error).toEqual("Expected distribution");
        }
    });
    test("When active distribution exist without beneficiaries Then no beneficiaries are provided", async () => {
        activeSesion.nameOfLastViewedDistribution = existingDistributionName;
        await database.addDistribution(existingDistribution);
        const beneficiaries = await sut.beneficiariesForActiveDistribution();
        expect(beneficiaries.length).toEqual(0);
    });
    test("When active distribution exist with beneficiaries Then they beneficiaries are provided", async () => {
        activeSesion.nameOfLastViewedDistribution = existingDistributionName;
        const distributions = await database.readDistributions();
        console.log(distributions);
        await database.addDistribution(existingDistribution);
        await database.addBenificiary(beneficiary1);
        await database.addBenificiary(beneficiary2);
        await database.addBeneficiaryToDistribution(beneficiary1, existingDistribution);
        await database.addBeneficiaryToDistribution(beneficiary2, existingDistribution);
        const beneficiaries = await sut.beneficiariesForActiveDistribution();
        expect(beneficiaries.length).toEqual(2);
        expect(beneficiaries[0].code).toEqual(beneficiaryCode1);
        expect(beneficiaries[1].code).toEqual(beneficiaryCode2);
    });
    test("When none of eligible beneficiaries of active distribution have been marked as recieved Then all of them are provided as eligible", async () => {
        activeSesion.nameOfLastViewedDistribution = existingDistributionName;
        const distributions = await database.readDistributions();
        console.log(distributions);
        await database.addDistribution(existingDistribution);
        await database.addBenificiary(beneficiary1);
        await database.addBenificiary(beneficiary2);
        await database.addBeneficiaryToDistribution(beneficiary1, existingDistribution);
        await database.addBeneficiaryToDistribution(beneficiary2, existingDistribution);
        const eligibleBeneficiaries = await sut.eligibleBeneficiariesForActiveDistribution();
        expect(eligibleBeneficiaries.length).toEqual(2);
    });
    test("When an eligible beneficiary of active distribution has been marked as recieved Then it is not provided as eligible anymore", async () => {
        activeSesion.nameOfLastViewedDistribution = existingDistributionName;
        const distributions = await database.readDistributions();
        console.log(distributions);
        await database.addDistribution(existingDistribution);
        await database.addBenificiary(beneficiary1);
        await database.addBenificiary(beneficiary2);
        await database.addBeneficiaryToDistribution(beneficiary1, existingDistribution);
        await database.addBeneficiaryToDistribution(beneficiary2, existingDistribution);
        await database.markBeneficiaryAsReceived(beneficiary1.code, existingDistributionName);
        const eligibleBeneficiaries = await sut.eligibleBeneficiariesForActiveDistribution();
        expect(eligibleBeneficiaries.length).toEqual(1);
    });
});

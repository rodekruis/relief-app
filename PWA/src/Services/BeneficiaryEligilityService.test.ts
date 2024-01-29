import {describe, test, expect, it} from '@jest/globals';
import { BeneficiaryEligilityService } from "./BeneficiaryEligilityService";
import { Database } from "./Database";
import { indexedDB } from "fake-indexeddb"
import { ActiveSession } from './ActiveSession';
import { Distribution } from '../Models/Distribution';
import { Beneficiary } from '../Models/Beneficiary';
import { fail } from 'assert';

const activeEligibleBeneficiaryCode = "1234AA"
const inActiveEligibleBeneficiaryCode = "5432"
const eligibleActiveDistributionBeneficiary = new Beneficiary(activeEligibleBeneficiaryCode, ["code", "name"], [activeEligibleBeneficiaryCode, "henry"])
const eligibleInactiveDistributionBeneficiary = new Beneficiary(activeEligibleBeneficiaryCode, ["code", "name"], [inActiveEligibleBeneficiaryCode, "tedd"])
const activeDistribution = new Distribution("items", "date", "place", "activeDistribution")
const inactiveDistribution = new Distribution("items", "date", "place", "inactiveDistribution")
const database = new Database(indexedDB)
database.addDistribution(activeDistribution)
database.addDistribution(inactiveDistribution)
database.addBeneficiaryToDistribution(eligibleActiveDistributionBeneficiary, activeDistribution)
database.addBeneficiaryToDistribution(eligibleInactiveDistributionBeneficiary, inactiveDistribution)
 
describe('BeneficiaryEligilityService during active distribution', () => {
    const activeSession = new ActiveSession(database)
    activeSession.nameOfLastViewedDistribution = activeDistribution.distrib_name
    const sut = new BeneficiaryEligilityService(activeSession)

    test("When checking elible code from inactive distribution", async () => {
        expect(await sut.isBenificiaryEligibleForCurrentDistribution(inActiveEligibleBeneficiaryCode)).toEqual(false)
    })
 });

 describe('BeneficiaryEligilityService during active distribution', () => {
    const activeSession = new ActiveSession(database)
    activeSession.nameOfLastViewedDistribution = activeDistribution.distrib_name
    const sut = new BeneficiaryEligilityService(activeSession)
    test("When checking elible code from active distribution", async () => {
        expect(await sut.isBenificiaryEligibleForCurrentDistribution(activeEligibleBeneficiaryCode)).toEqual(true)
    })
 });

 describe('BeneficiaryEligilityService during inActive distribution', () => {
    const activeSession = new ActiveSession(database)
    activeSession.nameOfLastViewedDistribution = undefined
    const sut = new BeneficiaryEligilityService(activeSession)

    test("When checking code", async () => {
        activeSession.nameOfLastViewedDistribution = undefined
        try {
            const result = await sut.isBenificiaryEligibleForCurrentDistribution("could have been any code")
            fail("Expected error")
        } catch(error) {
            expect(error).toEqual(Error("Expected active distribution"))
        }
    })
 });
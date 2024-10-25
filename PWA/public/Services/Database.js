import { DistributionBeneficiary } from "../Models/DistributionBeneficiary.js";
let db;
export var ObjectStoreName;
(function (ObjectStoreName) {
    ObjectStoreName["distribution"] = "Distributions";
    ObjectStoreName["beneficiary"] = "Beneficiaries";
    ObjectStoreName["distributionBeneficiaries"] = "DistributionBeneficiary";
})(ObjectStoreName || (ObjectStoreName = {}));
const allObjectStoreNames = [
    ObjectStoreName.beneficiary,
    ObjectStoreName.distribution,
    ObjectStoreName.distributionBeneficiaries,
];
function columnsForObjectStore(objectStore) {
    switch (objectStore) {
        case ObjectStoreName.distribution:
            return [
                { name: "distrib_name", isUnique: true },
                { name: "distrib_place", isUnique: false },
                { name: "distrib_date", isUnique: false },
                { name: "distrib_items", isUnique: false },
            ];
        case ObjectStoreName.beneficiary:
            return [
                { name: "code", isUnique: true },
                { name: "columns", isUnique: false },
                { name: "values", isUnique: false },
            ];
        case ObjectStoreName.distributionBeneficiaries:
            return [
                { name: "distributionName", isUnique: false },
                { name: "beneficiaryCode", isUnique: false },
                { name: "hasBeenMarkedAsReceived", isUnique: false },
                { name: "dateReceived", isUnique: false }
            ];
    }
}
export class Database {
    constructor(databaseFactory) {
        console.info("ℹ️ Constructing DataBase, should only happen once ");
        this.databaseFactory = databaseFactory;
        let db;
        const request = databaseFactory.open("data", 1);
        request.onerror = (err) => console.error(`IndexedDB error: ${request.error}`, err);
        request.onsuccess = () => (db = request.result);
        request.onupgradeneeded = () => {
            const db = request.result;
            allObjectStoreNames.forEach((storeName) => {
                const postsStore = db.createObjectStore(storeName, {
                    keyPath: storeName,
                    autoIncrement: true,
                });
                columnsForObjectStore(storeName).forEach((column) => postsStore.createIndex(column.name, column.name, {
                    unique: column.isUnique,
                }));
            });
        };
    }
    async readDistributions() {
        return this.getElement(ObjectStoreName.distribution);
    }
    async readBeneficiaries() {
        return this.getElement(ObjectStoreName.beneficiary);
    }
    async readDistributionBeneficiaries() {
        return this.getElement(ObjectStoreName.distributionBeneficiaries);
    }
    async distributionWithName(name) {
        const distributions = await this.readDistributions();
        console.log("known distributions:");
        console.log(distributions);
        const foundDistributions = distributions.filter((distribution) => distribution.distrib_name == name);
        if (foundDistributions.length > 0) {
            return foundDistributions[0];
        }
        else {
            return undefined;
        }
    }
    async beneficiaryWithCode(code) {
        const beneficiaries = await this.readBeneficiaries();
        const foundBeneficiaries = beneficiaries.filter((beneficiary) => beneficiary.code == code);
        if (foundBeneficiaries.length > 0) {
            return foundBeneficiaries[0];
        }
        else {
            return undefined;
        }
    }
    async addDistribution(distribution) {
        return this.addElement(ObjectStoreName.distribution, distribution);
    }
    async deleteDistributionWithName(name) {
        return this.removeElement(ObjectStoreName.distribution, await this.keyForDistributionWithName(name));
    }
    async benificiariesForDistribution(distribution) {
        const distributionBeneficiaries = await this.readDistributionBeneficiaries();
        console.log("distribution benefeciaries:");
        console.log(distributionBeneficiaries);
        return distributionBeneficiaries.filter((distributionBeneficiary) => distributionBeneficiary.distributionName == distribution.distrib_name);
    }
    async distributionBeneficiary(distribution, beneficiary) {
        let distributionBeneficiaries = await this.benificiariesForDistribution(distribution);
        let filteredDistributionBeneficiaries = distributionBeneficiaries
            .filter((distributionBeneficiary) => distributionBeneficiary.beneficiaryCode == beneficiary.code);
        if (filteredDistributionBeneficiaries.length > 0) {
            return filteredDistributionBeneficiaries[0];
        }
        else {
            return undefined;
        }
    }
    async addBeneficiary(beneficiary) {
        return this.addElement(ObjectStoreName.beneficiary, beneficiary);
    }
    async addBeneficiaryToDistribution(beneficiary, distribution) {
        const existing = await this.readDistributionBeneficiaries();
        existing.forEach((curent) => {
            if (curent.beneficiaryCode === beneficiary.code &&
                curent.distributionName === distribution.distrib_name) {
                throw Error("Beneficiary with code " + curent.beneficiaryCode + " was already added to distribution named " + curent.distributionName);
            }
        });
        const existingBeneficiary = await this.beneficiaryWithCode(beneficiary.code);
        if (!existingBeneficiary) {
            this.addBeneficiary(beneficiary);
        }
        return this.addElement(ObjectStoreName.distributionBeneficiaries, new DistributionBeneficiary(beneficiary.code, distribution.distrib_name));
    }
    async markBeneficiaryAsReceived(beneficiaryCode, distributionName) {
        const key = await this.keyForDistributionBeneficiary(beneficiaryCode, distributionName);
        this.updatElementIf(ObjectStoreName.distributionBeneficiaries, (beneficiary) => {
            return beneficiary.beneficiaryCode == beneficiaryCode && beneficiary.distributionName == distributionName;
        }, (beneficiary) => {
            beneficiary.hasBeenMarkedAsReceived = true;
            beneficiary.dateReceived = (new Date()).toUTCString();
            return beneficiary;
        });
    }
    async keyForDistributionBeneficiary(beneficiaryCode, distributionName) {
        const distributionBeneficiaries = await this.readDistributionBeneficiaries();
        for (let i = 0; i < distributionBeneficiaries.length; i++) {
            const currentBeneficiary = distributionBeneficiaries[i];
            if (currentBeneficiary.distributionName == distributionName && currentBeneficiary.beneficiaryCode == beneficiaryCode) {
                return i + 1;
            }
        }
        throw Error("Not found");
    }
    async keyForDistributionWithName(name) {
        const distributions = await this.readDistributions();
        const keys = await this.performRequestForObjectStoreNamed(ObjectStoreName.distribution, "readonly", (store) => {
            return store.getAllKeys();
        });
        let distributionIndex = 0;
        for (let i = 0; i < distributions.length; i++) {
            if (distributions[i].distrib_name == name) {
                distributionIndex = i;
                break;
            }
        }
        return keys[distributionIndex];
    }
    getElement(storeName, key = `all`) {
        return this.performRequestForObjectStoreNamed(storeName, "readonly", (store) => {
            return key === "all" ? store.getAll() : store.get(key);
        });
    }
    addElement(storeName, payload) {
        console.info("ℹ️ " + storeName + " will add:");
        console.debug(payload);
        return this.performRequestForObjectStoreNamed(storeName, "readwrite", (store) => {
            const serialized = JSON.parse(JSON.stringify(payload));
            return store.add(serialized);
        });
    }
    removeElement(storeName, key) {
        console.log("Will remove element " + key + " from store " + storeName);
        return this.performRequestForObjectStoreNamed(storeName, "readwrite", (store) => {
            return key === "all" ? store.clear() : store.delete(key);
        });
    }
    async updatElementIf(storeName, requirementCheck, updateFunction) {
        const objectStore = await this.objectStore(storeName, "readwrite");
        // Open a cursor to iterate over the store
        const cursorRequest = objectStore.openCursor();
        cursorRequest.onerror = (event) => {
            console.error('Error opening cursor', event);
            throw Error('Error opening cursor');
        };
        cursorRequest.onsuccess = (event) => {
            const cursor = cursorRequest.result;
            if (cursor) {
                const currentValue = cursor.value;
                // Check if the item meets the requirement
                if (requirementCheck(currentValue)) {
                    // Apply the update function
                    const updatedValue = updateFunction(currentValue);
                    // Update the record at the current cursor position
                    const updateRequest = cursor.update(updatedValue);
                    updateRequest.onerror = (event) => {
                        console.error('Error updating the object with cursor', event);
                        throw Error('Error updating the object with cursor');
                    };
                    updateRequest.onsuccess = () => {
                        console.log('Record updated successfully');
                    };
                }
                // Move to the next cursor position
                cursor.continue();
            }
        };
    }
    performRequestForObjectStoreNamed(storeName, transactionMode, makeRequest) {
        const open = this.openDatabaseRequest();
        return new Promise((resolve, reject) => {
            open.onsuccess = () => {
                this.objectStore(storeName, transactionMode)
                    .then((objectStore) => {
                    const request = makeRequest(objectStore);
                    request.onerror = () => reject(request.error);
                    request.onsuccess = () => resolve(request.result);
                })
                    .catch((error) => {
                    reject(error);
                });
            };
        });
    }
    objectStore(storeName, transactionMode) {
        const open = this.openDatabaseRequest();
        return new Promise((resolve, reject) => {
            open.onsuccess = () => {
                db = open.result;
                const transaction = db.transaction(storeName, transactionMode);
                const objectStore = transaction.objectStore(storeName);
                transaction.oncomplete = () => db.close();
                resolve(objectStore);
            };
        });
    }
    openDatabaseRequest() {
        const request = this.databaseFactory.open("data");
        request.onerror = (event) => {
            console.error('Error opening IndexedDB', event);
            throw Error('Error opening IndexedDB');
        };
        return request;
    }
}

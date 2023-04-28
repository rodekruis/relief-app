import { BenificiarySpreadSheetRow } from "../Models/BenificiarySpreadSheetRow.js";
import { Distribution } from "../Models/Distribution.js";
let db;
export var ObjectStoreName;
(function (ObjectStoreName) {
    ObjectStoreName["distribution"] = "Distributions";
    ObjectStoreName["benificiary"] = "Beneficiaries";
})(ObjectStoreName || (ObjectStoreName = {}));
const allObjectStoreNames = [ObjectStoreName.benificiary, ObjectStoreName.distribution];
function columnsForObjectStore(objectStore) {
    switch (objectStore) {
        case ObjectStoreName.distribution:
            return [
                { name: "distrib_name", isUnique: true },
                { name: "distrib_place", isUnique: false },
                { name: "distrib_date", isUnique: false },
                { name: "distrib_items", isUnique: false }
            ];
        case ObjectStoreName.benificiary:
            return [
                { name: "comma_separated_cells", isUnique: true }
            ];
    }
}
class Database {
    constructor() {
        let db;
        const request = indexedDB.open("data", 1);
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
        //Temporarily seed for debuging purposes
        this.addDistribution(new Distribution("24", "1/2/3", "Utrecht", "Sandwhiches"));
        this.addBenificiary(new BenificiarySpreadSheetRow("one, two, three"));
    }
    async readDistributions() {
        return this.getElement(ObjectStoreName.distribution);
    }
    async distributionsWithName(name) {
        const distributions = await this.readDistributions();
        return distributions.filter((distribution) => distribution.distrib_name == name);
    }
    async addDistribution(distribution) {
        return this.addElement(ObjectStoreName.distribution, distribution);
    }
    async deleteDistributionWithName(name) {
        return this.removeElement(ObjectStoreName.distribution, await this.keyForDistributionWithName(name));
    }
    async benificiariesForDistribution(distribution) {
        return this.getElement(ObjectStoreName.benificiary);
    }
    async addBenificiary(beneficiary) {
        return this.addElement(ObjectStoreName.benificiary, beneficiary);
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
    performRequestForObjectStoreNamed(storeName, transactionMode, makeRequest) {
        const open = indexedDB.open("data");
        return new Promise((resolve, reject) => {
            open.onsuccess = () => {
                db = open.result;
                if ([...db.objectStoreNames].find((name) => name === storeName)) {
                    const transaction = db.transaction(storeName, transactionMode);
                    const objectStore = transaction.objectStore(storeName);
                    const request = makeRequest(objectStore);
                    request.onerror = () => reject(request.error);
                    request.onsuccess = () => resolve(request.result);
                    transaction.oncomplete = () => db.close();
                }
                else {
                    indexedDB.deleteDatabase("data");
                }
            };
        });
    }
    editElement(store, key, payload) {
        const open = indexedDB.open("data");
        return new Promise((resolve, reject) => {
            open.onsuccess = () => {
                let request;
                db = open.result;
                if ([...db.objectStoreNames].find((name) => name === store)) {
                    const transaction = db.transaction(store, "readwrite");
                    const objectStore = transaction.objectStore(store);
                    if (key === "all")
                        request = objectStore.getAll();
                    else
                        request = objectStore.get(key);
                    request.onerror = () => reject(request.error);
                    request.onsuccess = () => {
                        const serialized = JSON.parse(JSON.stringify(payload));
                        const updateRequest = objectStore.put(serialized);
                        updateRequest.onsuccess = () => resolve(request.result);
                    };
                    transaction.oncomplete = () => db.close();
                }
                else {
                    indexedDB.deleteDatabase("data");
                }
            };
        });
    }
}
Database.instance = new Database();
export { Database };

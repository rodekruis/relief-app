import { BenificiarySpreadSheetRow } from "../Models/BenificiarySpreadSheetRow.js";
import { Distribution } from "../Models/Distribution.js";

let db: IDBDatabase

export enum ObjectStoreName {
    distribution = "Distributions",
    benificiary = "Beneficiaries"
}
const allObjectStoreNames = [ObjectStoreName.benificiary, ObjectStoreName.distribution]

type DatabaseColumn = {
    name: string;
    isUnique: boolean
};

function columnsForObjectStore(objectStore: ObjectStoreName): DatabaseColumn[] {
    switch (objectStore) {
        case ObjectStoreName.distribution:
            return [
                { name: "distrib_name", isUnique: true },
                { name: "distrib_place", isUnique: false },
                { name: "distrib_date", isUnique: false },
                { name: "distrib_items", isUnique: false }
            ]
            case ObjectStoreName.benificiary:
                return [
                  { name: "comma_separated_cells", isUnique: true }
                ]
    }
}

export class Database {
  static instance = new Database();

  private constructor() {
    let db!: IDBDatabase;
    const request = indexedDB.open("data", 1);
    request.onerror = (err) =>
      console.error(`IndexedDB error: ${request.error}`, err);
    request.onsuccess = () => (db = request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      allObjectStoreNames.forEach((storeName) => {
        const postsStore = db.createObjectStore(storeName, {
          keyPath: storeName,
          autoIncrement: true,
        });
        columnsForObjectStore(storeName).forEach((column) =>
          postsStore.createIndex(column.name, column.name, {
            unique: column.isUnique,
          })
        );
      });
    };
    //Temporarily seed for debuging purposes
    this.addDistribution(new Distribution("24", "1/2/3", "Utrecht", "Sandwhiches"))
    this.addBenificiary(new BenificiarySpreadSheetRow("one, two, three"))
  }

  async readDistributions(): Promise<[Distribution]> {
    return this.getElement(ObjectStoreName.distribution);
  }

  async distributionsWithName(name: string): Promise<Distribution[]> {
    const distributions = await this.readDistributions();
    return distributions.filter(
      (distribution) => distribution.distrib_name == name
    );
  }

  async addDistribution(distribution: Distribution): Promise<void> {
    return this.addElement(ObjectStoreName.distribution, distribution);
  }

  async deleteDistributionWithName(name: string): Promise<void> {
    return this.removeElement(
      ObjectStoreName.distribution,
      await this.keyForDistributionWithName(name)
    ) as Promise<void>;
  }

  async benificiariesForDistribution(
    distribution: Distribution
  ): Promise<BenificiarySpreadSheetRow[]> {
    return this.getElement(ObjectStoreName.benificiary);
  }

  async addBenificiary(beneficiary: BenificiarySpreadSheetRow): Promise<void> {
    return this.addElement(ObjectStoreName.benificiary, beneficiary)
  }

  private async keyForDistributionWithName(name: string): Promise<IDBValidKey> {
    const distributions = await this.readDistributions();
    const keys: number[] = await this.performRequestForObjectStoreNamed(
        ObjectStoreName.distribution,
        "readonly",
        (store: IDBObjectStore) => {
            return store.getAllKeys()
        }
    )
    let distributionIndex = 0
    for (let i = 0; i < distributions.length; i++) {
      if (distributions[i].distrib_name == name) {
        distributionIndex = i
        break
      }
    }

    return keys[distributionIndex];
  }

  private getElement<T>(
    storeName: ObjectStoreName,
    key: IDBValidKey | IDBKeyRange = `all`
  ): Promise<T> {
    return this.performRequestForObjectStoreNamed(
      storeName,
      "readonly",
      (store: IDBObjectStore) => {
        return key === "all" ? store.getAll() : store.get(key);
      }
    );
  }

  private addElement(storeName: ObjectStoreName, payload: object): Promise<void> {
    return this.performRequestForObjectStoreNamed(
      storeName,
      "readwrite",
      (store: IDBObjectStore) => {
        const serialized = JSON.parse(JSON.stringify(payload));
        return store.add(serialized);
      }
    );
  }

  private removeElement(storeName: ObjectStoreName, key: IDBValidKey | IDBKeyRange) {
    console.log("Will remove element " + key + " from store " + storeName);
    return this.performRequestForObjectStoreNamed(
        storeName,
        "readwrite",
        (store: IDBObjectStore) => {
            return key === "all" ? store.clear() : store.delete(key)
        }
      );
  }

  private performRequestForObjectStoreNamed<T>(
    storeName: string,
    transactionMode: IDBTransactionMode,
    makeRequest: (store: IDBObjectStore) => IDBRequest
  ): Promise<T> {
    const open = indexedDB.open("data");
    return new Promise<T>((resolve, reject) => {
      open.onsuccess = () => {
        db = open.result;
        if ([...db.objectStoreNames].find((name) => name === storeName)) {
          const transaction = db.transaction(storeName, transactionMode);
          const objectStore = transaction.objectStore(storeName);
          const request = makeRequest(objectStore);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve(request.result);
          transaction.oncomplete = () => db.close();
        } else {
          indexedDB.deleteDatabase("data");
        }
      };
    });
  }

  private editElement<T>(
    store: ObjectStoreName,
    key: IDBValidKey | IDBKeyRange,
    payload: object
  ): Promise<T> {
    const open = indexedDB.open("data");
    return new Promise<T>((resolve, reject) => {
      open.onsuccess = () => {
        let request: IDBRequest;
        db = open.result;
        if ([...db.objectStoreNames].find((name) => name === store)) {
          const transaction = db.transaction(store, "readwrite");
          const objectStore = transaction.objectStore(store);
          if (key === "all") request = objectStore.getAll();
          else request = objectStore.get(key);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => {
            const serialized = JSON.parse(JSON.stringify(payload));
            const updateRequest = objectStore.put(serialized);
            updateRequest.onsuccess = () => resolve(request.result);
          };
          transaction.oncomplete = () => db.close();
        } else {
          indexedDB.deleteDatabase("data");
        }
      };
    });
  }
}
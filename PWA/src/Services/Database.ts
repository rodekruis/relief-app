import { Beneficiary } from "../Models/Beneficiary.js";
import { Distribution } from "../Models/Distribution.js";

let db: IDBDatabase;

export enum ObjectStoreName {
  distribution = "Distributions",
  beneficiary = "Beneficiaries"
}
const allObjectStoreNames = [
  ObjectStoreName.beneficiary,
  ObjectStoreName.distribution
];

type DatabaseColumn = {
  name: string;
  isUnique: boolean;
};

function columnsForObjectStore(objectStore: ObjectStoreName): DatabaseColumn[] {
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
        { name: "code", isUnique: false },
        { name: "columns", isUnique: false },
        { name: "values", isUnique: false },
        { name: "distributionName", isUnique: false },
        { name: "hasBeenMarkedAsReceived", isUnique: false },
        { name: "dateReceived", isUnique: false }
      ];
  }
}

export class Database {
  databaseFactory: IDBFactory;

  constructor(databaseFactory: IDBFactory) {
    console.info("ℹ️ Constructing DataBase, should only happen once ");
    this.databaseFactory = databaseFactory;
    let db!: IDBDatabase;
    const request = databaseFactory.open("data", 1);
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
  }

  async readDistributions(): Promise<Distribution[]> {
    return this.getElement(ObjectStoreName.distribution);
  }

  async readBeneficiaries(): Promise<Beneficiary[]> {
    return this.getElement(ObjectStoreName.beneficiary);
  }

  async distributionWithName(name: string): Promise<Distribution | undefined> {
    const distributions = await this.readDistributions();
    console.log("known distributions:");
    console.log(distributions);
    const foundDistributions = distributions.filter(
      (distribution) => distribution.distrib_name == name
    );
    if (foundDistributions.length > 0) {
      return foundDistributions[0];
    } else {
      return undefined;
    }
  }

  async beneficiaryWithCode(code: string, distributionName: string): Promise<Beneficiary | undefined> {
    const beneficiaries = await this.readBeneficiaries();
    const foundBeneficiaries = beneficiaries.filter(
      (beneficiary) => beneficiary.code == code && beneficiary.distributionName == distributionName
    );
    if (foundBeneficiaries.length > 0) {
      return foundBeneficiaries[0];
    } else {
      return undefined;
    }
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

  async beneficiariesForDistributionNamed(
    distributionName: string
  ): Promise<Beneficiary[]> {
    const beneficiaries =
      await this.readBeneficiaries();
    console.log("distribution benefeciaries:");
    console.log(beneficiaries);
    return beneficiaries.filter(
      (beneficiary) =>
        beneficiary.distributionName == distributionName
    );
  }

  async addBeneficiary(beneficiary: Beneficiary): Promise<void> {
    return this.addElement(ObjectStoreName.beneficiary, beneficiary);
  }

  async markBeneficiaryAsReceived(beneficiaryCode: string, distributionName: string): Promise<void> {
    this.updatElementIf(
      ObjectStoreName.beneficiary,
       (beneficiary: Beneficiary) => {
        return beneficiary.code == beneficiaryCode && beneficiary.distributionName == distributionName
       }, (beneficiary: Beneficiary) => {
          beneficiary.hasBeenMarkedAsReceived = true
          beneficiary.dateReceived = (new Date()).toUTCString()
          return beneficiary
       }
      )
  }

  private async keyForDistributionWithName(name: string): Promise<IDBValidKey> {
    const distributions = await this.readDistributions();
    const keys: number[] = await this.performRequestForObjectStoreNamed(
      ObjectStoreName.distribution,
      "readonly",
      (store: IDBObjectStore) => {
        return store.getAllKeys();
      }
    );
    let distributionIndex = 0;
    for (let i = 0; i < distributions.length; i++) {
      if (distributions[i].distrib_name == name) {
        distributionIndex = i;
        break;
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

  private addElement(
    storeName: ObjectStoreName,
    payload: object
  ): Promise<void> {
    console.info("ℹ️ " + storeName + " will add:");
    console.debug(payload);
    return this.performRequestForObjectStoreNamed(
      storeName,
      "readwrite",
      (store: IDBObjectStore) => {
        const serialized = JSON.parse(JSON.stringify(payload));
        return store.add(serialized);
      }
    );
  }

  private removeElement(
    storeName: ObjectStoreName,
    key: IDBValidKey | IDBKeyRange
  ) {
    console.log("Will remove element " + key + " from store " + storeName);
    return this.performRequestForObjectStoreNamed(
      storeName,
      "readwrite",
      (store: IDBObjectStore) => {
        return key === "all" ? store.clear() : store.delete(key);
      }
    );
  }

  private async updatElementIf<T>(
    storeName: ObjectStoreName,
    requirementCheck: (item: T) => boolean,
    updateFunction: (item: T) => T
  ): Promise<void> {
      const objectStore = await this.objectStore(storeName, "readwrite")

      // Open a cursor to iterate over the store
      const cursorRequest = objectStore.openCursor();
  
      cursorRequest.onerror = (event) => {
        console.error('Error opening cursor', event);
        throw Error('Error opening cursor')
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
              throw Error('Error updating the object with cursor')
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
  

  private performRequestForObjectStoreNamed<T>(
    storeName: string,
    transactionMode: IDBTransactionMode,
    makeRequest: (store: IDBObjectStore) => IDBRequest
  ): Promise<T> {
    const open = this.openDatabaseRequest()
    return new Promise<T>((resolve, reject) => {
      open.onsuccess = () => {
        this.objectStore(storeName, transactionMode)
          .then((objectStore: IDBObjectStore) => {
            const request = makeRequest(objectStore)
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
          })
          .catch((error) => {
            reject(error)
          })
      };
    });
  }

  private objectStore(storeName: string, transactionMode: IDBTransactionMode,): Promise<IDBObjectStore> {
    const open = this.openDatabaseRequest()
    return new Promise<IDBObjectStore>((resolve, reject) => {
      open.onsuccess = () => {
        db = open.result;
        const transaction = db.transaction(storeName, transactionMode);
        const objectStore = transaction.objectStore(storeName);
        transaction.oncomplete = () => db.close();
        resolve(objectStore)
      };
    })
  }

  private openDatabaseRequest(): IDBOpenDBRequest {
    const request = this.databaseFactory.open("data");

    request.onerror = (event) => {
      console.error('Error opening IndexedDB', event);
      throw Error('Error opening IndexedDB')
    };

    return request
  }
}

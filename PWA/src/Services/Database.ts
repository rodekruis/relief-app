import { Beneficiary } from "../Models/Beneficiary.js";
import { Distribution } from "../Models/Distribution.js";
import { DistributionBeneficiary } from "../Models/DistributionBeneficiary.js";

let db: IDBDatabase;

export enum ObjectStoreName {
  distribution = "Distributions",
  beneficiary = "Benefeciaries",
  distributionBeneficiaries = "DistributionBeneficiary",
}
const allObjectStoreNames = [
  ObjectStoreName.beneficiary,
  ObjectStoreName.distribution,
  ObjectStoreName.distributionBeneficiaries
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
        { name: "code", isUnique: true },
        { name: "columns", isUnique: false },
        { name: "values", isUnique: false }
      ];
    case ObjectStoreName.distributionBeneficiaries:
      return [
        { name: "distributionName", isUnique: false },
        { name: "beneficiaryCode", isUnique: false }
      ];
  }
}

export class Database {
  databaseFactory: IDBFactory;

  constructor(databaseFactory: IDBFactory) {
    console.info("ℹ️ Constructing DataBase, should only happen once ")
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

  async readDistributionBeneficiaries(): Promise<DistributionBeneficiary[]> {
    return this.getElement(ObjectStoreName.distributionBeneficiaries);
  }

  async distributionWithName(name: string): Promise<Distribution | undefined> {
    const distributions = await this.readDistributions();
    console.log("known distributions:")
    console.log(distributions)
    const foundDistributions = distributions.filter(
      (distribution) => distribution.distrib_name == name
    );
    if (foundDistributions.length > 0) {
      return foundDistributions[0];
    } else {
      return undefined;
    }
  }

  async beneficiaryWithCode(code: string): Promise<Beneficiary | undefined> {
    const beneficiaries = await this.readBeneficiaries();
    const foundBeneficiaries = beneficiaries.filter(
      (beneficiary) => beneficiary.code == code
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

  async benificiariesForDistribution(
    distribution: Distribution
  ): Promise<DistributionBeneficiary[]> {
    const distributionBeneficiaries = await this.readDistributionBeneficiaries();
    console.log("distribution benefeciaries:")
    console.log(distributionBeneficiaries)
    return distributionBeneficiaries.filter(
        (distributionBeneficiary) => distributionBeneficiary.distributionName == distribution.distrib_name
      )
  }

  async addBenificiary(beneficiary: Beneficiary): Promise<void> {
    return this.addElement(ObjectStoreName.beneficiary, beneficiary);
  }

  async addBeneficiaryToDistribution(beneficiary: Beneficiary, distribution: Distribution): Promise<void> {
    const existing = await this.readDistributionBeneficiaries()
    existing.forEach( (curent) => {
      if(curent.beneficiaryCode === beneficiary.code && curent.distributionName === distribution.distrib_name) {
        throw Error("Beneficiary was already added to distribution")
      }
    })

    const existingBeneficiary = await this.beneficiaryWithCode(beneficiary.code)
    if(!existingBeneficiary) {
      this.addBenificiary(beneficiary)
    }

    return this.addElement(ObjectStoreName.distributionBeneficiaries, new DistributionBeneficiary(beneficiary.code, distribution.distrib_name))
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
    console.info("ℹ️ " + storeName + " will add:")
    console.debug(payload)
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

  private performRequestForObjectStoreNamed<T>(
    storeName: string,
    transactionMode: IDBTransactionMode,
    makeRequest: (store: IDBObjectStore) => IDBRequest
  ): Promise<T> {
    const open = this.databaseFactory.open("data");
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
          this.databaseFactory.deleteDatabase("data");
        }
      };
    });
  }

  private editElement<T>(
    store: ObjectStoreName,
    key: IDBValidKey | IDBKeyRange,
    payload: object
  ): Promise<T> {
    const open = this.databaseFactory.open("data");
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
          this.databaseFactory.deleteDatabase("data");
        }
      };
    });
  }
}

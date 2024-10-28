export class Beneficiary {
    constructor(code, columns, values, distributionName) {
        this.code = code;
        this.columns = columns;
        this.values = values;
        this.distributionName = distributionName;
        this.hasBeenMarkedAsReceived = false;
        this.dateReceived = undefined;
    }
}

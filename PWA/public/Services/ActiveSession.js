export class ActiveSession {
    constructor(database) {
        console.info("ℹ️ Constructing active session, should only happen once ");
        this.database = database;
    }
    get nameOfLastViewedDistribution() {
        return this._nameOfLastViewedDistribution;
    }
    set nameOfLastViewedDistribution(value) {
        console.log("ℹ️ name of last viewed distribution is now:");
        console.log(value);
        this._nameOfLastViewedDistribution = value;
    }
}
export class ActiveSessionContainer {
    constructor(activeSession) {
        this.activeSession = activeSession;
    }
}

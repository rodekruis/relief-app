class Distribution {
    constructor(distrib_items, distrib_date, distrib_place, distrib_name) {
        this.distrib_date = distrib_date;
        this.distrib_items = distrib_items;
        this.distrib_place = distrib_place;
        this.distrib_name = distrib_name;
    }
    equals(obj) {
        return this.distrib_name == obj.distrib_name;
    }
}
Distribution.colums = [
    "Name",
    "Location",
    "Date",
    "Items Distributed",
    "Donor",
];
export { Distribution };

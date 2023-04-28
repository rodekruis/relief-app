export class Distribution {
  distrib_items: string;
  distrib_date: string;
  distrib_place: string;
  distrib_name: string;

  constructor(
    distrib_items: string,
    distrib_date: string,
    distrib_place: string,
    distrib_name: string
  ) {
    this.distrib_date = distrib_date
    this.distrib_items = distrib_items
    this.distrib_place = distrib_place
    this.distrib_name = distrib_name
  }

  static colums: string[] = [
    "Name",
    "Location",
    "Date",
    "Items Distributed",
    "Donor",
  ]
}
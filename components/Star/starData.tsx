import UserData from "../User/userData";

export class Coordinate2D {
  coordinate: Array<number>;

  constructor(x: number, y: number) {
    this.coordinate = new Array(x, y);
  }
}

export default class StarData {
  ownUser: UserData;
  ownDate: Date;
  expireDate: Date;
  section: number;
  coordinate: Coordinate2D;

  constructor(
    ownUser: UserData,
    ownDate: Date,
    expireDate: Date,
    section: number,
    coordinate: Coordinate2D
  ) {
    this.ownUser = ownUser;
    this.ownDate = ownDate;
    this.expireDate = expireDate;
    this.section = section;
    this.coordinate = coordinate;
  }
}

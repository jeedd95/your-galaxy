export default class UserData {
  provider: string;
  locale: string;
  grade: number;
  name: string;
  email: string;
  profileUrl: string;
  joinDate: Date;
  lastestLogin: Date;
  lastestGetChance: Date;
  chance: number;

  constructor(
    provider: string,
    locale: string,
    grade: number,
    name: string,
    email: string,
    profileUrl: string,
    joinDate: Date,
    lastestLogin: Date,
    lastestGetChance: Date,
    chance: number
  ) {
    this.provider = provider;
    this.locale = locale;
    this.grade = grade;
    this.name = name;
    this.email = email;
    this.profileUrl = profileUrl;
    this.joinDate = joinDate;
    this.lastestLogin = lastestLogin;
    this.lastestGetChance = lastestGetChance;
    this.chance = chance;
  }
}

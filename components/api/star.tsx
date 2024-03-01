"use server";

import { connectDB } from "../../utils/DB/database";
import StarData, { Coordinate2D } from "../Star/starData";
import UserData from "../User/userData";
import { GetUserData } from "./user";

/**
 * 주인있는 모든 버튼 가져오기
 * @param section
 * @returns
 */
export async function GetAllOccupiedButtons(section: number) {
  let client = await connectDB;
  const db = client.db("Main");
  let result = await db
    .collection("star")
    .find({
      section: section,
      ownUser: { $not: { $eq: null } },
    })
    .toArray();

  return result;
}

/**
 * 별 놓기
 * @param x
 * @param y
 */
export async function PutStar(
  userEmail: string,
  x: number,
  y: number,
  section: number
) {
  let client = await connectDB;
  const db = client.db("Main");
  let userData: UserData;

  userData = await GetUserData(userEmail);

  const expireDate = new Date();
  expireDate.setMonth(new Date().getMonth() + 6);
  // console.logg("만료일은" + expireDate.toLocaleStrin());

  let doc = new StarData(
    userData,
    new Date(),
    expireDate,
    section,
    new Coordinate2D(x, y)
  );

  try {
    let duplicated = await db.collection("star").findOne({
      section: section,
      coordinate: new Coordinate2D(x, y),
    });

    // console.log("duplicated " + duplicated);

    if (duplicated) {
      throw new Error("Already occupied! It's a little late");
    } else {
      await db.collection("star").insertOne(doc);
      await db
        .collection("account")
        .updateOne({ email: userEmail }, { $inc: { chance: -1 } });
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * 좌표로 별 도큐먼트 찾기
 * @param section
 * @param coordinate
 */
export async function GetStar(section: number, c: Coordinate2D) {
  let client = await connectDB;
  const db = client.db("Main");

  let result = await db.collection("star").findOne({
    section: section,
    coordinate: c,
  });

  // console.log(result);
  return result;
}

/**
 * 만료된 별 찾아서 삭제하기
 * @param section
 */
export async function CheckExpiredStar(section: number) {
  let client = await connectDB;
  const db = client.db("Main");
  const now = new Date();

  let result = await db.collection("star").deleteMany({
    section: section,
    expireDate: { $lt: now },
  });

  // console.log(result);
}

/**
 * 이메일로 유저 별 가져오기
 * @param userEmail
 * @returns
 */
export async function GetUserStars(userEmail: string) {
  let client = await connectDB;
  const db = client.db("Main");

  let result = await db
    .collection("star")
    .find({ "ownUser.email": userEmail })
    .toArray();

  return result;
}

/**
 * 별 정보로 삭제하기
 * @param params
 */
export async function DeleteStar(section: number, coordinate: Coordinate2D) {
  console.log(section);
  console.log(coordinate);

  let client = await connectDB;
  const db = client.db("Main");

  let result = await db.collection("star").deleteOne({
    section: section,
    coordinate: { coordinate: coordinate },
  });

  if (result.deletedCount === 1) {
    console.log("Successfully deleted one document.");
  } else {
    console.log("No documents matched the query. Deleted 0 documents.");
  }
}

export async function DeleteUserStars(email: string) {
  let client = await connectDB;
  const db = client.db("Main");
  let result = await db.collection("star").deleteMany({
    "ownUser.email": email,
  });

  if (result.deletedCount > 0) {
    console.log(`Successfully deleted ${result.deletedCount} document.`);
  } else {
    console.log("No documents matched the query. Deleted 0 documents.");
  }
}

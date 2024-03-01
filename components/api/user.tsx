"use server";

import { connectDB } from "../../utils/DB/database";
import UserData from "../User/userData";

/**
 * 첫 로그인 유저 데이터만들고 DB에 넣기
 * @param userEmail
 */
export async function CreateUserData(props) {
  let client = await connectDB;
  const db = client.db("Main");

  const exist = await db
    .collection("account")
    .findOne({ email: props.user.email });

  if (exist) return; //이미 있을경우

  //제일 처음 로그인 할때
  const now = new Date();

  const doc = new UserData(
    props.account.provider,
    props.profile.locale,
    1,
    props.user.name,
    props.user.email,
    props.user.image,
    now,
    now,
    now,
    2
  );

  db.collection("account").insertOne(doc);
}

export async function LoginSuccess(props) {
  let client = await connectDB;
  const db = client.db("Main");
  const now = new Date();

  //로그인 할때마다 마지막 접속시간 업데이트
  await db
    .collection("account")
    .updateOne({ email: props.user.email }, { $set: { lastestLogin: now } });

  // GiveChance(props.user.email);
}

export async function GiveChance(email) {
  const now = new Date();
  const RESET_TIME = new Date();
  RESET_TIME.setUTCHours(21, 0, 0, 0); //24시 넘어가면 다음날 21시임

  let client = await connectDB;
  const db = client.db("Main");

  const result = await db.collection("account").findOne({ email: email });
  if (!result) return;

  const lastestGetChance: Date = result.lastestGetChance;

  if (now.getTime() >= RESET_TIME.getTime()) {
    if (lastestGetChance.getTime() < RESET_TIME.getTime()) {
      console.log("기회를 1회 증가합니다");
      await db
        .collection("account")
        .updateOne(
          { email: email, $lt: { chance: 5 } },
          { $set: { lastestGetChance: now }, $inc: { chance: +1 } }
        );
    } else {
      console.log("기회 이미 받음");
    }
  } else {
    console.log("아직 초기화 시간이 안됐음");
    const beforeReset = new Date();
    beforeReset.setUTCDate(now.getUTCDate() - 1);
    beforeReset.setUTCHours(21, 0, 0, 0);

    if (lastestGetChance.getTime() < beforeReset.getTime()) {
      console.log("이전 날의 초기화 시간 " + beforeReset.toUTCString());
      console.log("이전에 못 받았던 기회를 1회 증가합니다");
      await db
        .collection("account")
        .updateOne(
          { email: email, chance: { $lt: 5 } },
          { $set: { lastestGetChance: now }, $inc: { chance: +1 } }
        );
    }
  }
}

export async function GetUserData(email: string) {
  let client = await connectDB;
  const db = client.db("Main");
  let result = await db.collection("account").findOne({ email: email });

  // const result = new UserData(
  //   user.grade,
  //   user.name,
  //   user.email,
  //   user.profileUrl,
  //   user.joinDate,
  //   user.lastestLogin,
  //   user.lastestGetChance,
  //   user.chance
  // );

  return result;
}

export async function SignOut(email: string) {
  let client = await connectDB;
  const db = client.db("Main");
  let result = await db.collection("account").deleteOne({ email: email });

  if (result.deletedCount === 1) {
    console.log("Successfully deleted one document.");
  } else {
    console.log("No documents matched the query. Deleted 0 documents.");
  }
}

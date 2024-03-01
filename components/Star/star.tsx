"use client";

import Image from "next/image";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Avatar,
  Chip,
  Divider,
  Progress,
  Spinner,
} from "@nextui-org/react";
import styles from "../../styles/home.module.css";
import { DeleteStar, GetStar, PutStar } from "../api/star";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Coordinate2D } from "./starData";
import { useEffect, useState } from "react";
import { formattedDay } from "../../utils/time";
import { GetUserData } from "../api/user";

export default function Star(props) {
  const ROWS = 20;
  const COLS = 50;
  const buttons = [];
  let key = 0;

  for (let y = ROWS - 1; y >= 0; y--) {
    for (let x = 0; x <= COLS - 1; x++) {
      let isOccupied;

      props.allStarData.map((o) => {
        if (
          o.coordinate.coordinate[0] === x &&
          o.coordinate.coordinate[1] === y
        ) {
          isOccupied = true;
          return;
        }
      });

      buttons.push(
        <Popover key={++key} placement="right" backdrop="opaque" showArrow>
          <PopoverTrigger>
            <button className={styles.button}>
              {isOccupied ? (
                <Image src="/star.png" alt="star" width={10} height={10} />
              ) : (
                <div></div>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2 min-w-40">
              <StarDataUi section={props.section} x={x} y={y} />
            </div>
          </PopoverContent>
        </Popover>
      );
    }
  }

  return buttons;
}

function StarDataUi(props) {
  //좌표로 별 데이터 가져오기
  const [loading, setLoading] = useState(true); //로딩 상태
  const { data: session } = useSession(); //세션
  const [starData, setStarData] = useState(null); //별 데이터
  const [userData, setUserData] = useState(null); //유저 데이터

  let coordinate = new Coordinate2D(props.x, props.y);
  coordinate = JSON.parse(JSON.stringify(coordinate));

  async function fetchData() {
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    const result = await GetStar(Number(props.section), coordinate);
    if (session) {
      const result = await GetUserData(session.user.email);
      setUserData(result);
    }
    setStarData(result);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function Top() {
    return (
      <div className="flex items-center justify-between">
        <Chip size="sm">
          ({props.x},{props.y})
        </Chip>
        {starData ? (
          <Avatar size="sm" src={starData.ownUser.profileUrl} />
        ) : (
          <Avatar size="sm" />
        )}
      </div>
    );
  }

  function Middle() {
    if (starData) {
      const now = new Date();
      const ownDate = new Date(starData.ownDate);
      const expireDate = new Date(starData.expireDate);
      const expireRemain = expireDate.getTime() - now.getTime();

      const [remain, setRemain] = useState(0);
      useEffect(() => {
        const interval = setInterval(() => {
          setRemain(expireRemain);
        }, 1000);

        return () => {
          clearInterval(interval);
        };
      });

      const f = formattedDay(remain);

      return (
        <div>
          <div className={styles.label}>Birth</div>
          <div>{ownDate.toLocaleString()}</div>
          <div className={styles.label}>Expire to</div>
          <div>{`${f.days}d ${f.hours}h ${f.minutes}m ${f.seconds}s`}</div>
          <Progress
            aria-label="expire remain"
            maxValue={expireDate.getTime() - ownDate.getTime()}
            value={now.getTime() - ownDate.getTime()}
            size="sm"
            color="warning"
            isStriped
          />
        </div>
      );
    } else {
      return <div>😲 Put the star first !</div>;
    }
  }

  function Bottom() {
    const router = useRouter();
    const [confirmDelete, setConfirmDelete] = useState(false);

    //로그인이 안됬을때
    if (!session) {
      return (
        <Button
          style={{ fontSize: "15px" }}
          color="primary"
          variant="solid"
          size="sm"
          fullWidth
          onClick={() => {
            signIn("google", { callbackUrl: "/" });
          }}
        >
          Log In
        </Button>
      );
    }
    //로그인 일떄
    //  별이 이미 차지했을때
    //    그게 나의 별일때
    //    다른 사람의 별일때
    //  빈 공간 일때
    //    기회가 남아있을때
    //    기회가 남아있지않을때
    else {
      if (starData != null) {
        if (session.user.email === starData.ownUser.email) {
          return !confirmDelete ? (
            <Button
              style={{ fontSize: "15px" }}
              color="danger"
              variant="solid"
              size="sm"
              fullWidth
              onClick={() => {
                setConfirmDelete(true);
              }}
            >
              Delete
            </Button>
          ) : (
            <Button
              style={{ fontSize: "15px" }}
              color="danger"
              variant="solid"
              size="sm"
              fullWidth
              onClick={async () => {
                DeleteStar(starData.section, starData.coordinate.coordinate);
                await fetchData();
                router.refresh();
              }}
            >
              Are you sure?
            </Button>
          );
        } else {
          return (
            <Button
              style={{ fontSize: "15px" }}
              color="primary"
              variant="solid"
              size="sm"
              fullWidth
              isDisabled
            >
              Already occupied
            </Button>
          );
        }
      } else {
        if (!userData) return;
        if (userData.chance > 0) {
          return (
            <Button
              style={{ fontSize: "15px" }}
              color="primary"
              variant="solid"
              size="sm"
              fullWidth
              onClick={async () => {
                await PutStar(
                  session.user.email,
                  props.x,
                  props.y,
                  Number(props.section)
                );
                await fetchData();
                router.refresh();
              }}
            >
              Put My Star
            </Button>
          );
        } else {
          return (
            <Button
              style={{ fontSize: "15px" }}
              color="primary"
              variant="solid"
              size="sm"
              isDisabled
            >
              You don't have a chance
            </Button>
          );
        }
      }
    }
  }

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  } else {
    return (
      <div>
        <Top />
        <Divider className="my-1" />
        <Middle />
        <Divider className="my-2" />
        <Bottom />
      </div>
    );
  }
}

//원본
// function StarDataUi(props) {
//   //좌표로 별 데이터 가져오기
//   const [starData, setStarData] = useState(null);

//   let coordinate = new Coordinate2D(props.x, props.y);
//   coordinate = JSON.parse(JSON.stringify(coordinate));

//   useEffect(() => {
//     async function f() {
//       const result = await GetStar(Number(props.section), coordinate);
//       setStarData(result);
//     }

//     f();
//   }, []);

//   function Top() {
//     return (
//       <div className="flex items-center justify-between">
//         <Chip size="sm">
//           ({props.x},{props.y})
//         </Chip>
//         {starData ? (
//           <Avatar size="sm" src={starData.ownUser.profileUrl} />
//         ) : (
//           <Avatar size="sm" />
//         )}
//       </div>
//     );
//   }

//   function Middle() {
//     if (starData) {
//       const now = new Date();
//       const ownDate = new Date(starData.ownDate);
//       const expireDate = new Date(starData.expireDate);
//       const expireRemain = expireDate.getTime() - now.getTime();

//       const [remain, setRemain] = useState(0);
//       useEffect(() => {
//         const interval = setInterval(() => {
//           setRemain(expireRemain);
//         }, 1000);

//         return () => {
//           clearInterval(interval);
//         };
//       });

//       const f = formattedDay(remain);

//       return (
//         <div>
//           <div className={styles.label}>Birth</div>
//           <div>{ownDate.toLocaleString()}</div>
//           <div className={styles.label}>Expire to</div>
//           <div>{`${f.days}d ${f.hours}h ${f.minutes}m ${f.seconds}s`}</div>
//           <Progress
//             aria-label="p"
//             maxValue={expireDate.getTime() - ownDate.getTime()}
//             value={now.getTime() - ownDate.getTime()}
//             size="sm"
//             color="warning"
//             isStriped
//           />
//         </div>
//       );
//     } else {
//       return <div>😲 Put the star first !</div>;
//     }
//   }

//   function Bottom() {
//     const router = useRouter();
//     const { data: session } = useSession();

//     //로그인이 안됬을때
//     if (!session) {
//       return (
//         <Button
//           style={{ fontSize: "15px" }}
//           color="primary"
//           variant="solid"
//           size="sm"
//           fullWidth
//           onClick={() => {
//             signIn("google", { callbackUrl: "/" });
//           }}
//         >
//           Log In
//         </Button>
//       );
//     }
//     //로그인 일떄
//     //별이 이미 차지했을때
//     //빈 공간 일때
//     else {
//       if (starData != null) {
//         return (
//           <Button
//             style={{ fontSize: "15px" }}
//             color="primary"
//             variant="solid"
//             size="sm"
//             fullWidth
//             isDisabled
//           >
//             Already occupied
//           </Button>
//         );
//       } else {
//         return (
//           <Button
//             style={{ fontSize: "15px" }}
//             color="primary"
//             variant="solid"
//             size="sm"
//             fullWidth
//             onClick={() => {
//               PutStar(
//                 session.user.email,
//                 props.x,
//                 props.y,
//                 Number(props.section)
//               );
//               router.refresh();
//             }}
//           >
//             Put My Star
//           </Button>
//         );
//       }
//     }
//   }

//   return (
//     <div>
//       <Top />
//       <Divider className="my-1" />
//       <Middle />
//       <Divider className="my-2" />
//       <Bottom />
//     </div>
//   );
// }

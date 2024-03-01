import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Spacer,
  useDisclosure,
} from "@nextui-org/react";
import { Accept } from "../Modal/modal";
import styles from "../../styles/modal.module.css";
import { SignOut } from "../api/user";
import { useRouter } from "next/navigation";
import { DeleteUserStars } from "../api/star";
import { signOut } from "next-auth/react";

export default function UserUi(props) {
  const router = useRouter();
  // console.log(props.session);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  let userData = JSON.parse(JSON.stringify(props.userData));

  return (
    <>
      <Card>
        <CardBody>
          <div className={styles.label}>Account Provider</div>
          <div>{userData.provider}</div>
          <div className={styles.label}>grade</div>
          <div>{userData.grade}</div>
          <div className={styles.label}>email</div>
          <div>{userData.email}</div>
          <div className={styles.label}>Join Date</div>
          <div>{new Date(userData.joinDate).toLocaleString()}</div>
          <div className={styles.label}>Chance</div>
          <div>{userData.chance}</div>
        </CardBody>
        <CardFooter className="flex justify-end">
          <Button size="sm" color="danger" onPress={onOpen}>
            Sign Out
          </Button>
        </CardFooter>
      </Card>
      <Accept
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Sign Out"
        content={
          <div>
            <div>Are you sure you want to Sign out?</div>
            <Spacer y={3} />
            <div>All stars and account will be deleted</div>
          </div>
        }
        actionFunc={() => {
          SignOut(userData.email);
          DeleteUserStars(userData.email);
          signOut();
        }}
      />
    </>
  );
}

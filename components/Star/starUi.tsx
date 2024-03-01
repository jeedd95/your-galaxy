import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Spacer,
  useDisclosure,
} from "@nextui-org/react";
import styles from "../../styles/modal.module.css";
import { Accept } from "../Modal/modal.js";
import { DeleteStar } from "../api/star";
import { useRouter } from "next/navigation";

export default function StarUi(props) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // console.log(props.starData);
  const ownDate = JSON.parse(
    JSON.stringify(props.starData.ownDate.toLocaleString())
  );
  const expireDate = JSON.parse(
    JSON.stringify(props.starData.expireDate.toLocaleString())
  );

  return (
    <>
      <Card
        className="w-full"
        style={{ border: "0.2px solid #006FEE" }}
        // isPressable --> 푸터의 버튼이랑 중첩되어 안됨
      >
        <CardHeader
          className="flex gap-0.5 cursor-pointer"
          onClick={() => {
            router.push("/" + props.starData.section);
            router.refresh();
          }}
        >
          <Chip color="warning" size="sm">
            section {props.starData.section}
          </Chip>
          <Spacer x={1} />
          <Chip color="primary" size="sm">
            ({props.starData.coordinate.coordinate[0]},
            {props.starData.coordinate.coordinate[1]})
          </Chip>
        </CardHeader>
        <Divider />
        <CardBody
          className="cursor-pointer"
          onClick={() => {
            router.push("/" + props.starData.section);
            router.refresh();
          }}
        >
          <div className={styles.label}>Own Date</div>
          <div>{ownDate}</div>
          <Spacer y={1} />
          <div className={styles.label}>Expire Date</div>
          <div>{expireDate}</div>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-end">
          <Button size="sm" color="danger" onPress={onOpen}>
            Delete
          </Button>
        </CardFooter>
      </Card>
      <Accept
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Delete"
        content={
          <div>
            <p>Are you sure you want to Delete it?</p>
            Chance is not returned.
          </div>
        }
        actionFunc={() => {
          DeleteStar(
            props.starData.section,
            props.starData.coordinate.coordinate
          );
          router.refresh();
        }}
      />
    </>
  );
}

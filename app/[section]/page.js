import Star from "../../components/Star/star";
import styles from "../../styles/home.module.css";
import {
  CheckExpiredStar,
  GetAllOccupiedButtons,
} from "../../components/api/star";

export default async function Home(props) {
  await CheckExpiredStar(Number(props.params.section));

  /* 선택한 섹션의 모든 버튼 도큐먼트 가져오기*/
  let allStarData = await GetAllOccupiedButtons(Number(props.params.section));
  allStarData = JSON.parse(JSON.stringify(allStarData));

  return (
    <div className={styles.container}>
      <Star allStarData={allStarData} section={props.params.section} />
    </div>
  );
}

import { standings } from '../../type/type';
import styles from './HomeFootBallStandingsCard.module.css';

interface Props {
    info: standings;
}

export function HomeFootBallStandingsCard({ info }: Props) {
    return (
        <li key={info.team.shortName} className={styles.list}>
            <div className={styles.left_box}>
                <p className={styles.ranking}>{info.position}위</p>
                <div className={styles.img_name}>
                    <img src={info.team.crest} alt='' />
                    <p>{info.team.shortName}</p>
                </div>
            </div>
            <div className={styles.right_box}>
                <p>{`${info.won}승${info.draw}무${info.lost}패`}</p>
                <p>{`${info.playedGames}게임 ${info.points}점`}</p>
                <p>{`${info.goalsFor}골 ${info.goalsAgainst}실`}</p>
            </div>
        </li>
    );
}

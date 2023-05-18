import { standings } from '../../type/type';
import styles from './FootballStandingsCard.module.css';

interface Props {
    info: standings;
}

export function FootballStandingsCard({ info }: Props) {
    return (
        <li className={styles.item}>
            <p>{info.position}</p>
            <div className={styles.team}>
                <img src={info.team.crest} />
                <p>{info.team.shortName}</p>
            </div>
            <p>{info.playedGames}</p>
            <p>{info.points}</p>
            <p>{info.won}</p>
            <p>{info.draw}</p>
            <p>{info.lost}</p>
            <p>{info.goalsFor}</p>
            <p>{info.goalsAgainst}</p>
            <p>{info.goalDifference}</p>
        </li>
    );
}

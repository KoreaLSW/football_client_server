import { Score } from '../../type/type';
import styles from './FootballPlayerCard.module.css';

interface Props {
    info: Score;
    ranking: number;
}

export function FootballPlayerCard({ info, ranking }: Props) {
    return (
        <li className={styles.player}>
            <p>{ranking + 1}</p>
            <p>{info.player.name}</p>
            <p>{info.player.dateOfBirth}</p>
            <div className={styles.team}>
                <img src={info.team.crest} alt='' />
                <p>{info.team.name}</p>
            </div>
            <p>
                {info.goals}({info.penalties})
            </p>
            <p>{info.assists}</p>
        </li>
    );
}

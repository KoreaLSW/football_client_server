import { footBallVideo } from '../../type/type';
import styles from './HomeVideoCard.module.css';

interface Props {
    info: footBallVideo;
    callback(id: string): void;
}

export function HomeVideoCard({ info, callback }: Props) {
    return (
        <li className={styles.list} onClick={() => callback(info.id.videoId)}>
            <img src={info.snippet.thumbnails.medium.url} alt='' />
            <div className={styles.text_box}>
                <p className={styles.title}>{info.snippet.channelTitle}</p>
                <p className={styles.description}>{info.snippet.description}</p>
            </div>
        </li>
    );
}

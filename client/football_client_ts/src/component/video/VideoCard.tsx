import { format, register } from 'timeago.js';
import koLocale from 'timeago.js/lib/lang/ko';
import styles from './VideoCard.module.css';
import { footBallVideo } from '../../type/type';

interface Props {
    item: footBallVideo;
    modal(id: string): void;
}

export function VideoCard({ item, modal }: Props) {
    return (
        <div className={styles.item} onClick={() => modal(item.id.videoId)}>
            <img src={item.snippet.thumbnails.medium.url} alt='' />
            <div>
                <p className={styles.description}>{item.snippet.description}</p>
                <p className={styles.title}>{item.snippet.channelTitle}</p>
                <div>
                    <p>{formatAgo(item.snippet.publishedAt, 'ko')} </p>
                </div>
            </div>
        </div>
    );
}
register('ko', koLocale);
export function formatAgo(date: string, lang = 'en_US') {
    return format(date, lang);
}

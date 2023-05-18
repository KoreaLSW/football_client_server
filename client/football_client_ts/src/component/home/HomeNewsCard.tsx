import { news } from '../../type/type';
import styles from './HomeNewsCard.module.css';
interface Props {
    info: news;
}

export function HomeNewsCard({ info }: Props) {
    return (
        <li className={styles.list}>
            <img src={info.imgurl} alt='' />
            <a href={info.link} target='_blank'>
                {info.title
                    .replace(/<[^>]*>?/g, '')
                    .replace(/&amp;/g, '')
                    .replace(/&quot;/g, '')
                    .replace(/&apos;/g, '')
                    .replace(/\"n/, '')}
            </a>
        </li>
    );
}

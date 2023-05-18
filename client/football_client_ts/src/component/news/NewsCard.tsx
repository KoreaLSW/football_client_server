import { news } from '../../type/type';
import styles from './NewsCard.module.css';
import { useState } from 'react';

interface Props {
    info: news;
}
export function NewsCard({ info }: Props) {
    const [date, setDate] = useState(info.pubDate.split(' ', 4));

    return (
        <li className={styles.card}>
            <div className={styles.img_box}>
                <img className={styles.img} src={info.imgurl} alt='' />
            </div>
            <div className={styles.text_box}>
                <a href={info.link} target='_blank' className={styles.title}>
                    {info.title
                        .replace(/<[^>]*>?/g, '')
                        .replace(/&amp;/g, '')
                        .replace(/&quot;/g, '')
                        .replace(/&apos;/g, '')
                        .replace(/\"n/, '')}
                </a>
                <p className={styles.description}>
                    {info.description
                        .replace(/<[^>]*>?/g, '')
                        .replace(/&amp;/g, '')
                        .replace(/&quot;/g, '')
                        .replace(/&apos;/g, '')
                        .replace(/\"n/, '')}
                </p>
                <p className={styles.date}>
                    {date &&
                        `${date[3]}년 ${dataEngToKor(date[2])} ${date[1]}일`}
                </p>
            </div>
        </li>
    );
}

function dataEngToKor(date: string) {
    let month = '';
    switch (date) {
        case 'Jan':
            month = '1월';
            break;
        case 'Feb':
            month = '2월';
            break;
        case 'Mar':
            month = '3월';
            break;
        case 'Apr':
            month = '4월';
            break;
        case 'May':
            month = '5월';
            break;
        case 'Jun':
            month = '6월';
            break;
        case 'Jul':
            month = '7월';
            break;
        case 'Aug':
            month = '8월';
            break;
        case 'Sept':
            month = '9월';
            break;
        case 'Oct':
            month = '10월';
            break;
        case 'Nov':
            month = '11월';
            break;
        case 'Dec':
            month = '12월';
            break;
    }
    return month;
}

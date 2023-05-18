import { commentInfo } from '../../type/type';
import styles from './CommentCard.module.css';

interface Props {
    info: commentInfo;
}

export function CommentCard({ info }: Props) {
    return (
        <li className={styles.list}>
            <img src={info.user_img} alt='' />
            <div className={styles.text_box}>
                <div className={styles.top_box}>
                    <p>{info.user_nickname}</p>
                    <p>{info.comment_date}</p>
                </div>
                <p>{info.comment_content}</p>
            </div>
        </li>
    );
}

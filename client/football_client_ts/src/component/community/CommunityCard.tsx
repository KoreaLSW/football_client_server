import { communityRead } from '../../type/type';
import styles from './CommunityCard.module.css';
import { useNavigate } from 'react-router-dom';

interface Props {
    data: communityRead;
}

export function CommunityCard({ data }: Props) {
    const movePage = useNavigate();

    const handleClick = () => {
        movePage('/Community/CommunityRead', { state: { data } });
    };

    return (
        <li className={styles.item} onClick={handleClick}>
            <div className={styles.title}>
                <span>{data.community_title}</span>
            </div>
            <div className={styles.user}>
                <img src={data.user_img} alt='' />
                <span>{data.user_nickname}</span>
            </div>
            <div className={styles.date}>
                <span>{data.community_date}</span>
            </div>
            <div className={styles.views}>
                <span>{data.community_view}</span>
            </div>
            <div className={styles.thumb}>
                <span>{data.community_commend}</span>
            </div>
        </li>
    );
}

import { AiOutlineEye } from 'react-icons/ai';
import { FiThumbsUp } from 'react-icons/fi';
import styles from './HomeCommunityCard.module.css';
import { useNavigate } from 'react-router-dom';
import { communityRead } from '../../type/type';

interface Props {
    info: communityRead;
}

export function HomeCommunityCard({ info }: Props) {
    const movePage = useNavigate();

    const handleClick = () => {
        movePage('/Community/CommunityRead', { state: { data: info } });
    };

    return (
        <li
            key={info.community_no}
            className={styles.list}
            onClick={handleClick}
        >
            <div className={styles.top}>
                <img src={info.user_img} />
                <p className={styles.nickname}>{info.user_nickname}</p>
                <AiOutlineEye />
                <p className={styles.view}>·{info.community_view}</p>
                <FiThumbsUp />
                <p>·{info.community_commend}</p>
            </div>
            <div className={styles.bottom}>
                <p>{info.community_title}</p>
            </div>
        </li>
    );
}

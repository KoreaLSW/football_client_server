import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './User.module.css';
import { login, logout } from '../../redux/provider';
import { logout as userLogout } from '../../api/server';

type userInfo = {
    img: string | undefined;
    id: string;
    pw: string;
    email: string;
    nickname: string;
};

interface Props {
    session: userInfo;
    setMobileCheck: React.Dispatch<React.SetStateAction<boolean>>;
}

export function User({ session, setMobileCheck }: Props) {
    const dispatch = useDispatch();
    const movePage = useNavigate();

    const handleLogout = () => {
        userLogout();
        alert('로그아웃 되었습니다.');
        dispatch(logout());
        movePage('/');
        window.location.reload();
    };

    const handleClick = (key: string) => {
        movePage('/UserInfoUpdate', { state: { key } });
        setMobileCheck((res) => {
            return !res;
        });
    };

    return (
        <div className={styles.user}>
            <img
                className={styles.img}
                src={session.img ? session.img : '/image/user.png'}
                alt=''
                onClick={() => handleClick('img')}
            />
            <p className={styles.nick} onClick={() => handleClick('user')}>
                {session && session.nickname} 님
            </p>
            <button className={styles.logout} onClick={handleLogout}>
                로그아웃
            </button>
        </div>
    );
}

import { Link } from 'react-router-dom';
import styles from './LoginButton.module.css';
interface Props {
    setMobileCheck: React.Dispatch<React.SetStateAction<boolean>>;
}
export function LoginButton({ setMobileCheck }: Props) {
    const handleClick = () => {
        setMobileCheck((res) => !res);
    };

    return (
        <div className={styles.login_box}>
            <Link to='/Login' onClick={handleClick}>
                <div className={styles.login_button}>로그인</div>
            </Link>
            <Link to='/SingUp' onClick={handleClick}>
                <div className={styles.sign_up_button}>회원가입</div>
            </Link>
        </div>
    );
}

import { TbFaceIdError } from 'react-icons/tb';
import styles from './ErrorPage.module.css';

interface Props {
    errorCode: string;
}

export function ErrorPage({ errorCode }: Props) {
    return (
        <div className={styles.error}>
            <p className={styles.icon}>
                <TbFaceIdError />
            </p>
            <p className={styles.text}>{errorCode}</p>
            <p>일일 트래픽 초과...</p>
        </div>
    );
}

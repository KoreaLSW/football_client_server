import styles from './Modal.module.css';
import { IoMdArrowBack } from 'react-icons/io';

interface Props {
    videoId: string;
    setModalType: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Modal({ videoId, setModalType }: Props) {
    return (
        <div className={styles.modal}>
            <div className={styles.top_box} onClick={() => setModalType(false)}>
                <IoMdArrowBack />
            </div>
            <div className={styles.video}>
                <iframe src={`https://www.youtube.com/embed/${videoId}`} />
            </div>
        </div>
    );
}

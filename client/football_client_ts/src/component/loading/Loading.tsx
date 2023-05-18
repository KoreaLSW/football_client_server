import styles from './Loading.module.css';

export function Loading() {
    return (
        <div className={styles.loading_box}>
            <img
                className={styles.loading}
                src='./image/loading2.gif'
                alt='로딩중'
            />
            <p>로딩중....</p>
        </div>
    );
}

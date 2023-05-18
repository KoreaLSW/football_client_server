import { useState } from 'react';
import styles from './Login.module.css';
import { AiFillGithub } from 'react-icons/ai';
import { useQuery } from '@tanstack/react-query';
import { loginCheck } from '../api/server';
import { AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/provider';
import { useNavigate } from 'react-router-dom';
import { googlelogin } from '../api/firebase';

type userInfo = {
    img: string | undefined;
    id: string;
    pw: string;
    pwCk: string;
    email: string;
    nickname: string;
    logintype: string;
};

export function Login() {
    const dispatch = useDispatch();
    const movePage = useNavigate();
    const [userInfo, setUserInfo] = useState<userInfo>({
        img: '',
        id: '',
        pw: '',
        pwCk: '',
        email: '',
        nickname: '',
        logintype: '',
    });

    const handleChang = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        setUserInfo((res) => ({ ...res, [name]: value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const user: AxiosResponse<any, any> = await loginCheck(
            userInfo.id,
            userInfo.pw
        );

        if (userInfo.id === '') {
            alert('아이디를 입력해 주세요');
            return;
        } else if (userInfo.pw === '') {
            alert('비밀번호를 입력해 주세요');
            return;
        } else if (!user.data) {
            alert('아이디나 비밀번호를 확인해주세요.');
            return;
        }
        const userLoginInfo: userInfo = {
            img: user.data[0].user_img,
            id: user.data[0].user_id,
            pw: '',
            pwCk: '',
            email: user.data[0].user_email,
            nickname: user.data[0].user_nickname,
            logintype: 'basic',
        };

        dispatch(login(userLoginInfo));
        movePage('/');
        //window.location.reload();
    };

    const handleGoogleLogin = async () => {
        const user: AxiosResponse<any, any> | void = await googlelogin();
        if (user && !user.data[0]) {
            alert('회원정보가 없습니다.');
            return;
        }

        if (user && user.data[0]) {
            const userLoginInfo: userInfo = {
                img: user.data[0].user_img,
                id: user.data[0].user_id,
                pw: '',
                pwCk: '',
                email: user.data[0].user_email,
                nickname: user.data[0].user_nickname,
                logintype: 'google',
            };

            dispatch(login(userLoginInfo));
            movePage('/');
        }
    };
    return (
        <div className={styles.login}>
            <div className={styles.login_container}>
                <h1 className={styles.title}>로그인</h1>
                <form className={styles.login_form}>
                    <span>아이디</span>
                    <input
                        type='text'
                        name='id'
                        value={userInfo.id ?? ''}
                        onChange={handleChang}
                    />
                    <span>패스워드</span>
                    <input
                        type='password'
                        name='pw'
                        value={userInfo.pw ?? ''}
                        onChange={handleChang}
                    />
                    <div className={styles.git_box} onClick={handleGoogleLogin}>
                        <AiFillGithub />
                    </div>
                    <button className={styles.login_btn} onClick={handleLogin}>
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
}

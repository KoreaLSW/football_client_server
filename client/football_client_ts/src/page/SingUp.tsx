import { useState } from 'react';
import styles from './SingUp.module.css';
import { AiFillGithub } from 'react-icons/ai';
import useSingUp from '../hooks/useSingUp';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/provider';
import { uploadImage } from '../api/server';
import { gitsingup } from '../api/firebase';

type userInfo = {
    img: string;
    id: string;
    pw: string;
    pwCk: string;
    email: string;
    nickname: string;
    logintype: string;
};

export function SingUp() {
    const dispatch = useDispatch();
    const movePage = useNavigate();
    const [file, setFile] = useState<File>();
    const [userInfo, setUserInfo] = useState<userInfo>({
        img: '',
        id: '',
        pw: '',
        pwCk: '',
        email: '',
        nickname: '',
        logintype: 'basic',
    });

    const {
        idCheck: { data: userIdCheck },
        nickNameCheck: { data: nickNameCheck },
        singUphook: { mutate, isLoading },
    } = useSingUp(userInfo.id, userInfo.nickname);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value, files } = e.target;
        if (name === 'file' && files) {
            setFile(files && files[0]);
            return;
        }
        setUserInfo((res) => ({ ...res, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (userIdCheck && 0 < userIdCheck.data[0].cnt) {
            alert('이미 사용중인 아이디 입니다.');
            return;
        } else if (userInfo && userInfo.pw !== userInfo.pwCk) {
            alert('암호를 확인해 주세요.');
            return;
        } else if (nickNameCheck && 0 < nickNameCheck.data[0].cnt) {
            alert('이미 사용중인 닉네임 입니다.');
            return;
        } else if (
            userInfo.id === '' ||
            userInfo.pw === '' ||
            userInfo.email === '' ||
            userInfo.nickname === ''
        ) {
            alert('회원 정보를 확인해주세요');
            return;
        } else if (20 < userInfo.id.length) {
            return alert('아이디는 최대 20자리 입니다.');
        } else if (20 < userInfo.pw.length) {
            return alert('패스워드는 최대 20자리 입니다.');
        } else if (8 < userInfo.nickname.length) {
            return alert('닉네임은 최대 8자리 입니다.');
        }
        if (file) {
            uploadImage(file, userInfo.id, 'profile').then((url) => {
                userInfo.img = url;
                mutate(userInfo, {
                    onError: (error, variables, context) => {
                        console.log('error : ', error);
                    },
                });
                dispatch(login(userInfo));
                movePage('/');
            });
        } else {
            mutate(userInfo, {
                onError: (error, variables, context) => {
                    console.log('error : ', error);
                },
            });
            //dispatch(login(userInfo));
            movePage('/');
        }
    };

    const handleGitLogin = async () => {
        const code = await gitsingup();

        if (code && code.data.errno === 1062) {
            alert('이미 가입된 이메일입니다.');
            return;
        } else {
            if (code && code.config.data) {
                const data: string = code.config.data;
                const userInfoList = data.slice(1, -1).split(',');
                const userInfo: any = {
                    img: '',
                    id: '',
                    pw: '',
                    pwCk: '',
                    email: '',
                    nickname: '',
                    logintype: 'google',
                };
                userInfoList.map((value: string) => {
                    if (
                        value.substring(0, value.indexOf(':')).slice(1, -1) ===
                        'img'
                    ) {
                        userInfo[
                            value.substring(0, value.indexOf(':')).slice(1, -1)
                        ] =
                            'https://' +
                            value
                                .substring(value.lastIndexOf(':') + 2)
                                .slice(1, -1);
                    } else {
                        userInfo[
                            value.substring(0, value.indexOf(':')).slice(1, -1)
                        ] = value
                            .substring(value.lastIndexOf(':') + 1)
                            .slice(1, -1);
                    }
                });
                dispatch(login(userInfo));
                movePage('/');
            }
        }
    };
    return (
        <div className={styles.login}>
            <div className={styles.login_container}>
                <h1 className={styles.title}>회원가입</h1>
                <form className={styles.login_form} onSubmit={handleSubmit}>
                    <span>프로필 사진</span>
                    {file ? (
                        <img
                            className={styles.user_img}
                            src={URL.createObjectURL(file)}
                            alt='local file'
                        />
                    ) : (
                        <img
                            className={styles.user_img}
                            src='./image/user.png'
                        />
                    )}
                    <input
                        className={styles.input_file}
                        type='file'
                        accept='image/*'
                        name='file'
                        onChange={handleChange}
                    />
                    <span>아이디(20자 이내)</span>
                    {userIdCheck && 0 < userIdCheck.data[0].cnt && (
                        <span className={styles.login_idcheck}>
                            이미 사용중인 아이디입니다.
                        </span>
                    )}
                    <input
                        name='id'
                        value={userInfo.id ?? ''}
                        type='text'
                        onChange={handleChange}
                    />
                    <span>패스워드(20자 이내)</span>
                    <input
                        name='pw'
                        value={userInfo.pw ?? ''}
                        type='password'
                        onChange={handleChange}
                    />
                    <span>패스워드 확인</span>
                    {userInfo && userInfo.pw !== userInfo.pwCk && (
                        <span className={styles.login_idcheck}>
                            비밀번호가 다릅니다. 다시 한번 확인해주세요.
                        </span>
                    )}
                    <input
                        name='pwCk'
                        value={userInfo.pwCk ?? ''}
                        type='password'
                        onChange={handleChange}
                    />
                    <span>이메일</span>
                    <input
                        name='email'
                        value={userInfo.email ?? ''}
                        type='email'
                        onChange={handleChange}
                    />
                    <span>닉네임(8자 이내)</span>
                    {nickNameCheck && 0 < nickNameCheck.data[0].cnt && (
                        <span className={styles.login_idcheck}>
                            이미 사용중인 닉네임입니다.
                        </span>
                    )}
                    <input
                        name='nickname'
                        value={userInfo.nickname ?? ''}
                        type='text'
                        onChange={handleChange}
                    />
                    <div className={styles.git_box} onClick={handleGitLogin}>
                        <AiFillGithub />
                    </div>
                    <button className={styles.login_btn}>
                        {isLoading ? '로딩중..' : '회원가입'}
                    </button>
                </form>
            </div>
        </div>
    );
}

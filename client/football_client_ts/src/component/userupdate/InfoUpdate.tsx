import { logout, userNickNameUpdate, userPwUpdate } from '../../api/server';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import styles from './InfoUpdate.module.css';
import useSingUp from '../../hooks/useSingUp';
import { useNavigate } from 'react-router-dom';
import { userInfo } from '../../type/type';

interface Props {
    user: userInfo;
}

export function InfoUpdate({ user }: Props) {
    const movePage = useNavigate();
    const [id, setId] = useState<string>(user.id);
    const [pw, setPw] = useState<string>('');
    const [pwCk, setPwck] = useState<string>('');
    const [nickname, setNickname] = useState<string>(user.nickname);

    const queryClient = useQueryClient();
    const { data, isLoading, mutate } = useMutation(
        (value: userInfo) => userNickNameUpdate(id, nickname),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['userInfo']);
            },
        }
    );

    const {
        nickNameCheck: { data: nickNameCheck },
    } = useSingUp(user.id, nickname);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        if (name === 'pw') {
            setPw(value);
        } else if (name === 'pwCk') {
            setPwck(value);
        } else {
            setNickname(value);
        }
    };

    const handlePWSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pw !== pwCk) {
            alert('비밀번호가 다릅니다. 다시 확인해 주세요');
            return;
        }
        userPwUpdate(id, pw);
        logout();
        alert('변경되었습니다. 다시 로그인 해주세요.');
        movePage('/');
    };

    const handleNickSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nickNameCheck && nickNameCheck.data[0].cnt) {
            alert('이미 사용중인 닉네임입니다.');
            return;
        }

        mutate(user, {
            onSuccess: () => {
                // dispatch(login(userInfo));
                alert('완료되었습니다.');
                movePage('/');
            },
            onError: (error, variables, context) => {
                console.log('error : ', error);
            },
        });
    };
    return (
        <div className={styles.info}>
            <div className={styles.info_container}>
                <h1 className={styles.title}>유저정보 업데이트</h1>
                <div className={styles.update_box}>
                    <div className={styles.left_box}>
                        <h2 className={styles.left_box_title}>비밀번호 변경</h2>
                        <form
                            className={styles.left_box_form}
                            onSubmit={handlePWSubmit}
                        >
                            <span>패스워드</span>
                            <input
                                name='pw'
                                value={pw ?? ''}
                                type='password'
                                onChange={handleChange}
                            />
                            <span>패스워드 확인</span>
                            {pw !== pwCk && (
                                <span className={styles.idcheck}>
                                    비밀번호가 다릅니다. 다시 한번 확인해주세요.
                                </span>
                            )}
                            <input
                                name='pwCk'
                                value={pwCk ?? ''}
                                type='password'
                                onChange={handleChange}
                            />
                            <button className={styles.left_box_btn}>
                                비밀번호 변경
                            </button>
                        </form>
                    </div>
                    <div className={styles.right_box}>
                        <h2 className={styles.right_box_title}>닉네임 변경</h2>

                        <form
                            className={styles.right_box_form}
                            onSubmit={handleNickSubmit}
                        >
                            <span>닉네임</span>
                            <input
                                name='nickname'
                                value={nickname ?? ''}
                                type='text'
                                onChange={handleChange}
                            />
                            {nickNameCheck && 0 < nickNameCheck.data[0].cnt && (
                                <span className={styles.nicknameck}>
                                    이미 사용중인 닉네임입니다.
                                </span>
                            )}
                            <button>닉네임 변경</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

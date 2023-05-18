import { uploadImage, userImgUpdate } from '../../api/server';
import styles from './ImgUpdate.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userInfo } from '../../type/type';

interface Props {
    user: userInfo;
}

export function ImgUpdate({ user }: Props) {
    const queryClient = useQueryClient();
    const movePage = useNavigate();

    const [file, setFile] = useState<File>();
    const [userInfo, setUserInfo] = useState<userInfo>(user);

    const { data, isLoading, mutate } = useMutation(
        (value: userInfo) => userImgUpdate(value),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['userInfo']);
            },
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (file) {
            uploadImage(file, userInfo.id, 'profile').then((url) => {
                const img = url;
                setUserInfo((value) => ({ ...value, img }));
                const user: userInfo = {
                    id: userInfo.id,
                    pw: '',
                    email: '',
                    nickname: '',
                    img,
                    logintype: '',
                };

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
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value, files } = e.target;
        if (name === 'file' && files) {
            setFile(files && files[0]);
            return;
        }
    };
    //console.log('로딩', isLoading);
    return (
        <div className={styles.imgupdate}>
            <div className={styles.imgupdate_container}>
                <h1 className={styles.title}>이미지 수정</h1>
                <img
                    src={
                        user && user.img
                            ? file
                                ? URL.createObjectURL(file)
                                : user.img
                            : file
                            ? URL.createObjectURL(file)
                            : '/image/user.png'
                    }
                    alt='user_img'
                />
                <form className={styles.login_form} onSubmit={handleSubmit}>
                    <input
                        className={styles.input_file}
                        type='file'
                        accept='.jpg, .png'
                        name='file'
                        onChange={handleChange}
                    />
                    <button>
                        {isLoading ? '로딩중...' : '이미지 업데이트'}
                    </button>
                </form>
            </div>
        </div>
    );
}

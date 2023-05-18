import { useState, useRef, useEffect } from 'react';
import { uploadImage, userSessionCheck } from '../api/server';
import { useSelector } from 'react-redux';
import useCommunity from '../hooks/useCommunity';
import styles from './CommunityWrite.module.css';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { communityWrite, community_CRUD } from '../type/type';
type imgFile = {
    [key: string]: File;
};

export function CommunityWrite() {
    const { data: sessionUser } = useQuery(['userInfo'], userSessionCheck, {
        staleTime: 1000 * 60,
    });
    const movePage = useNavigate();
    if (!sessionUser?.id) {
        movePage('/Login');
    }
    const location = useLocation();
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const user = useSelector((state: any) => state.userInfo.User);
    const { write, update } = useCommunity(user.id);
    const [file, setFile] = useState<imgFile>({});
    const [community, setCommunity] = useState<communityWrite>({
        id: user.id,
        title: '',
        date: '',
        content: '',
        view: '0',
        commend: '0',
        img01: '',
        img02: '',
        img03: '',
        img04: '',
        img05: '',
    });
    const [info, setInfo] = useState<community_CRUD>({
        no: '',
        id: '',
    });
    const [check, setCheck] = useState<boolean>(false);
    useEffect(() => {
        try {
            setCommunity({
                id: location.state.data.user_id,
                title: location.state.data.community_title,
                date: location.state.data.community_date,
                content: location.state.data.community_content,
                view: location.state.data.community_view,
                commend: location.state.data.community_commend,
                img01: location.state.data.community_img_01,
                img02: location.state.data.community_img_02,
                img03: location.state.data.community_img_03,
                img04: location.state.data.community_img_04,
                img05: location.state.data.community_img_05,
            });
            setInfo({
                no: location.state.data.community_no,
                id: location.state.data.user_id,
            });
            console.log(location.state.data);
        } catch (error) {
            setCheck(true);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value, files } = e.target;
        if (files) {
            setFile((res) => ({ ...res, [name]: files[0] }));
            return;
        }

        setCommunity((res) => ({ ...res, [name]: value }));
    };

    const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        setCommunity((res) => ({ ...res, [name]: value }));
    };

    if (inputRef.current !== null) {
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }

    const handleSubmit = () => {
        if (!community.title) {
            return alert('제목을 입력해주세요.');
        }
        if (!community.content) {
            return alert('내용을 입력해주세요.');
        }
        if (Object.keys(file).length !== 0) {
            console.log('파일 있음');

            Object.keys(file).map((value, index, row) => {
                //console.log('파일', file[value]);
                uploadImage(file[value], user.id, 'community').then((url) => {
                    if (value === 'img01') {
                        community.img01 = url;
                    } else if (value === 'img02') {
                        community.img02 = url;
                    } else if (value === 'img03') {
                        community.img03 = url;
                    } else if (value === 'img04') {
                        community.img04 = url;
                    } else if (value === 'img05') {
                        community.img05 = url;
                    }

                    if (index + 1 === row.length) {
                        if (check) {
                            write.mutate(community, {
                                onError: (error, variables, context) => {
                                    console.log('error : ', error);
                                },
                            });
                        } else {
                            update.mutate(
                                { community, info },
                                {
                                    onError: (error, variables, context) => {
                                        console.log('error : ', error);
                                    },
                                }
                            );
                        }
                    }
                });
            });

            // file.map((value, index, row) =>
            //     uploadImage(value.img, user.id, 'community').then((url) => {
            //         if (index === 0) {
            //             community.img01 = url;
            //         } else if (index === 1) {
            //             community.img02 = url;
            //         } else if (index === 2) {
            //             community.img03 = url;
            //         } else if (index === 3) {
            //             community.img04 = url;
            //         } else if (index === 4) {
            //             community.img05 = url;
            //         }
            //         console.log('community', community);
            //         if (index + 1 === row.length) {
            //             write.mutate(community, {
            //                 onError: (error, variables, context) => {
            //                     console.log('error : ', error);
            //                 },
            //             });
            //         }
            //     })
            // );
        } else {
            console.log('파일 없음');
            if (check) {
                write.mutate(community, {
                    onError: (error, variables, context) => {
                        console.log('error : ', error);
                    },
                });
            } else {
                update.mutate(
                    { community, info },
                    {
                        onError: (error, variables, context) => {
                            console.log('error : ', error);
                        },
                    }
                );
            }
        }
        movePage('/Community');
    };

    const hancleFocus = () => {
        if (inputRef.current !== null) {
            inputRef.current.focus();
        }
    };
    return (
        <div className={styles.communitywrite}>
            <div className={styles.communitywrite_container}>
                <h1 className={styles.title}>
                    {check ? '게시글 작성' : '게시글 수정'}
                </h1>
                <div className={styles.form}>
                    <div className={styles.title_box}>
                        <p className={styles.form_title}>제목: </p>
                        <input
                            className={styles.form_title_input}
                            type='text'
                            name='title'
                            value={community.title && community.title}
                            onChange={handleChange}
                        />
                    </div>
                    <p className={styles.form_content_title}>내용</p>
                    <div
                        className={styles.form_content_container}
                        onClick={hancleFocus}
                    >
                        {file.img01 ? (
                            <img src={URL.createObjectURL(file.img01)} />
                        ) : (
                            community.img01 && <img src={community.img01} />
                        )}
                        {file.img02 ? (
                            <img src={URL.createObjectURL(file.img02)} />
                        ) : (
                            community.img02 && <img src={community.img02} />
                        )}
                        {file.img03 ? (
                            <img src={URL.createObjectURL(file.img03)} />
                        ) : (
                            community.img03 && <img src={community.img03} />
                        )}
                        {file.img04 ? (
                            <img src={URL.createObjectURL(file.img04)} />
                        ) : (
                            community.img04 && <img src={community.img04} />
                        )}
                        {file.img05 ? (
                            <img src={URL.createObjectURL(file.img05)} />
                        ) : (
                            community.img05 && <img src={community.img05} />
                        )}
                        <textarea
                            className={styles.form_content_container_input}
                            name='content'
                            onChange={handleTextarea}
                            value={community.content && community.content}
                            ref={inputRef}
                        />
                    </div>
                    <div className={styles.form_img_input_box}>
                        <input
                            type='file'
                            accept='image/*'
                            name='img01'
                            onChange={handleChange}
                        />
                        <input
                            type='file'
                            accept='image/*'
                            name='img02'
                            onChange={handleChange}
                        />
                        <input
                            type='file'
                            accept='image/*'
                            name='img03'
                            onChange={handleChange}
                        />
                        <input
                            type='file'
                            accept='image/*'
                            name='img04'
                            onChange={handleChange}
                        />
                        <input
                            type='file'
                            accept='image/*'
                            name='img05'
                            onChange={handleChange}
                        />
                    </div>
                    <button onClick={handleSubmit}>
                        {' '}
                        {check ? '작성하기' : '수정하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}

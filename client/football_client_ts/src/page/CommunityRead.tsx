import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { communityRead, userSessionCheck } from '../api/server';
import styles from './CommunityRead.module.css';
import { useState, useEffect, useRef } from 'react';
import { FiThumbsUp } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import useCommunity from '../hooks/useCommunity';
import { useNavigate } from 'react-router-dom';
import { commentInfo, commentWrite, community_CRUD } from '../type/type';
import { CommentCard } from '../component/community/CommentCard';
import { useQuery } from '@tanstack/react-query';

export function CommunityRead() {
    const location = useLocation();
    const movePage = useNavigate();
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { data: sessionUser } = useQuery(['userInfo'], userSessionCheck, {
        staleTime: 1000 * 60,
    });
    //const user = useSelector((state: any) => state.userInfo.User);

    const [comment, setComment] = useState<any>();
    const [commentWrite, setCommentWrite] = useState<commentWrite>({
        user_id: sessionUser ? sessionUser.id : '',
        commend_no: location.state.data.community_no,
        comment_date: '',
        comment_content: '',
    });
    const {
        readDetail: { data: communityRead },
        comment: { data: commentRead },
        remove,
        viewPlus,
        commendPlus,
        commentInsert,
    } = useCommunity(location.state.data.community_no);

    // const [communityRead, setCommunityRead] = useState<communityRead>(
    //     location.state.data
    // );
    const info: community_CRUD = {
        no: location.state.data.community_no,
        id: location.state.data.user_id,
    };

    useEffect(() => {
        viewPlus.mutate(location.state.data.community_no, {
            onError: (error, variables, context) => {
                console.log('error : ', error);
            },
        });
    }, []);

    useEffect(() => {
        if (commentRead) {
            setComment(commentRead);
        }
    }, [commentRead]);

    const handleClick = () => {
        commendPlus.mutate(info, {
            onSuccess: (data) => {
                console.log('data : ', data);
                if (data.data.errno === 1062) {
                    alert('이미 추천했습니다.');
                    return;
                }
                alert('추천 되었습니다.');
            },
            onError: (error, variables, context) => {
                console.log('error : ', error);
            },
        });
    };

    const handleDelete = () => {
        remove.mutate(info, {
            onSuccess: (data) => {
                //console.log('data : ', data);
                alert('삭제 되었습니다.');

                movePage('/Community');
            },
            onError: (error, variables, context) => {
                console.log('error : ', error);
            },
        });
    };

    const handleUpdate = () => {
        movePage('/Community/CommunityWrite', {
            state: { data: location.state.data },
        });
    };

    const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();

        const { name, value } = e.target;
        setCommentWrite((res) => ({ ...res, [name]: value }));
    };

    if (inputRef.current !== null) {
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }

    const hancleFocus = () => {
        if (inputRef.current !== null) {
            inputRef.current.focus();
        }
    };

    const handleComment = () => {
        commentInsert.mutate(commentWrite, {
            onSuccess: (data) => {
                alert('댓글 작성 완료');
                window.location.reload();
            },
            onError: (error, variables, context) => {
                console.log('error : ', error);
            },
        });
    };

    return (
        <div className={styles.communityRead}>
            <div className={styles.communityRead_container}>
                <div className={styles.title_box}>
                    <span>제목: </span>
                    <h1>
                        {communityRead && communityRead.data[0].community_title}
                    </h1>
                </div>
                <div className={styles.user_box}>
                    <span>작성자:</span>
                    <img
                        src={
                            communityRead && communityRead.data[0].user_img
                                ? communityRead &&
                                  communityRead.data[0].user_img
                                : './image/user.png'
                        }
                    />
                    <p>
                        {communityRead && communityRead.data[0].user_nickname}
                    </p>
                </div>
                <div className={styles.views_commend_date_box}>
                    <div className={styles.left_box}>
                        <div className={styles.view_box}>
                            <AiOutlineEye />
                            <span>
                                {communityRead &&
                                    communityRead.data[0].community_view}
                            </span>
                        </div>
                        <div className={styles.commend_box}>
                            <FiThumbsUp />
                            <span>
                                {communityRead &&
                                    communityRead.data[0].community_commend}
                            </span>
                        </div>
                    </div>
                    <div className={styles.right_box}>
                        <span>작성날짜: </span>
                        <span>
                            {communityRead &&
                                communityRead.data[0].community_date}
                        </span>
                    </div>
                </div>
                <div className={styles.button_box}>
                    <button onClick={handleClick}>추천</button>
                    {sessionUser &&
                        sessionUser.id === location.state.data.user_id && (
                            <button onClick={handleDelete}>삭제</button>
                        )}
                    {sessionUser &&
                        sessionUser.id === location.state.data.user_id && (
                            <button onClick={handleUpdate}>수정</button>
                        )}
                </div>
                <div className={styles.content_box}>
                    {communityRead &&
                        communityRead.data[0].community_img_01 && (
                            <img
                                src={
                                    communityRead &&
                                    communityRead.data[0].community_img_01
                                }
                            />
                        )}
                    {communityRead &&
                        communityRead.data[0].community_img_02 && (
                            <img
                                src={
                                    communityRead &&
                                    communityRead.data[0].community_img_02
                                }
                            />
                        )}
                    {communityRead &&
                        communityRead.data[0].community_img_03 && (
                            <img
                                src={
                                    communityRead &&
                                    communityRead.data[0].community_img_03
                                }
                            />
                        )}
                    {communityRead &&
                        communityRead.data[0].community_img_04 && (
                            <img
                                src={
                                    communityRead &&
                                    communityRead.data[0].community_img_04
                                }
                            />
                        )}
                    {communityRead &&
                        communityRead.data[0].community_img_05 && (
                            <img
                                src={
                                    communityRead &&
                                    communityRead.data[0].community_img_05
                                }
                            />
                        )}

                    {communityRead &&
                        communityRead.data[0].community_content
                            .split(`\n`)
                            .map((line: string, index: number) => {
                                return (
                                    <span key={index}>
                                        {line}
                                        <br />
                                    </span>
                                );
                            })}
                </div>
                <div className={styles.comment}>
                    <h2>댓글</h2>
                    {comment &&
                        comment.data.map(
                            (value: commentInfo, index: number) => {
                                return (
                                    <ul key={index}>
                                        <CommentCard info={value} />
                                    </ul>
                                );
                            }
                        )}
                </div>
                {sessionUser?.id && (
                    <div className={styles.commentWrith}>
                        <h2>댓글 쓰기</h2>
                        <div onClick={hancleFocus}>
                            <textarea
                                className={styles.form_content_container_input}
                                name='comment_content'
                                onChange={handleTextarea}
                                value={
                                    commentWrite.comment_content &&
                                    commentWrite.comment_content
                                }
                                ref={inputRef}
                            />
                        </div>
                        <button onClick={handleComment}>작성하기</button>
                    </div>
                )}
            </div>
        </div>
    );
}

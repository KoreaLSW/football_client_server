import React, { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { footBallVideo } from '../api/server';
import { VideoCard } from '../component/video/VideoCard';
import styles from './FootballVideo.module.css';
import { Modal } from '../component/modal/Modal';
import { Loading } from '../component/loading/Loading';
import { ErrorPage } from './ErrorPage';
import { footBallVideo as footBallVideoType } from '../type/type';

export function FootballVideo() {
    const [nextToken, setNextToken] = useState('');
    const [videos, setVideos] = useState<any>();
    const [videoError, setVideoError] = useState<any>();
    const [videoId, setVideoId] = useState<string>('');
    const [modalType, setModalType] = useState<boolean>(false);
    const [ref, inView] = useInView();
    const [keyword, setKeyword] = useState('프리미어리그');
    const { isLoading, isFetching, error, data, fetchNextPage, hasNextPage } =
        useInfiniteQuery(
            ['mainVideos', keyword],
            ({ pageParam }) => footBallVideo(pageParam, keyword),
            {
                getNextPageParam: (lastPage: any, pages) => {
                    if (!lastPage.isLast) {
                        return (lastPage.current_page = nextToken);
                    }
                    return undefined;
                },
                staleTime: 1000 * 60 * 5,
            }
        );
    useEffect(() => {
        data && setVideos(data);
    }, [data]);

    useEffect(() => {
        error && setVideoError(error);
    }, [error]);

    useEffect(() => {
        if (inView && hasNextPage) {
            setNextToken(
                () => videos.pages[videos.pages.length - 1].data.nextPageToken
            );
        }
    }, [inView]);

    const handleClick = () => {
        fetchNextPage();
    };

    const handleOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setKeyword(e.target.value);
    };

    const handleModal = (id: string) => {
        setVideoId(id);
        setModalType(true);
    };

    //console.log('error', error);

    return (
        <div className={styles.footballvideo}>
            <div className={styles.footballvideo_container}>
                <div className={styles.title_box}>
                    <h1>축구영상</h1>
                    <select onChange={handleOption}>
                        <option value='프리미어리그'>프리미어리그</option>
                        <option value='프리메라리가'>프리메라리가</option>
                        <option value='세리에'>세리에</option>
                        <option value='분데스리가'>분데스리가</option>
                        <option value='리그앙'>리그앙</option>
                    </select>
                </div>
                {videoError && <ErrorPage errorCode={videoError.message} />}
                {isLoading ? (
                    <Loading />
                ) : (
                    <ul className={styles.video_list}>
                        {videos &&
                            videos.pages.map((page: any) =>
                                page.data.items.map(
                                    (
                                        value: footBallVideoType,
                                        index: number
                                    ) => {
                                        if (index < 24) {
                                            return (
                                                <li key={index}>
                                                    <VideoCard
                                                        item={value}
                                                        modal={handleModal}
                                                    />
                                                </li>
                                            );
                                        } else {
                                            return (
                                                <li key={index} ref={ref}>
                                                    <VideoCard
                                                        item={value}
                                                        modal={handleModal}
                                                    />
                                                </li>
                                            );
                                        }
                                    }
                                )
                            )}
                    </ul>
                )}
                {!isLoading && isFetching && <Loading />}
                {modalType && (
                    <Modal videoId={videoId} setModalType={setModalType} />
                )}

                <div className={styles.button_box}>
                    <button onClick={handleClick}>더보기</button>
                </div>
            </div>
        </div>
    );
}

import { useInfiniteQuery } from '@tanstack/react-query';
import { footBallNews } from '../api/server';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { NewsCard } from '../component/news/NewsCard';
import { useInView } from 'react-intersection-observer';
import styles from './FootballNews.module.css';
import { Loading } from '../component/loading/Loading';
import { news } from '../type/type';

export function FootballNews() {
    const [option, setOption] = useState('프리미어리그');
    const [data, setData] = useState<any>();
    const [ref, inView] = useInView();
    const [nextToken, setNextToken] = useState('');
    const {
        isLoading,
        isFetching,
        error,
        data: items,
        fetchNextPage,
        hasNextPage,
        status,
    } = useInfiniteQuery(
        ['footBallNews', option],
        ({ pageParam = 1 }) => footBallNews(option, pageParam),
        {
            getNextPageParam: (lastPage: any, pages: any) => {
                if (!lastPage.isLast) {
                    //console.log('lastPage', lastPage);

                    return lastPage.data.start + 10;
                }
                return undefined;
            },
            staleTime: 1000 * 60 * 1,
        }
    );

    useEffect(() => {
        items && setData(items);
    }, [items]);

    //const [data, setData] = useState<any>();

    //data && console.log(data);
    const handleClick = () => {
        fetchNextPage();
    };

    const handleOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOption(e.target.value);
    };

    return (
        <div className={styles.news}>
            <div className={styles.news_container}>
                <div className={styles.title_box}>
                    <h1 className={styles.title}>축구뉘우스</h1>

                    <select className={styles.options} onChange={handleOption}>
                        <option value='프리미어리그'>프리미어리그</option>
                        <option value='프리메라리가'>프리메라리가</option>
                        <option value='세리에'>세리에</option>
                        <option value='분데스리가'>분데스리가</option>
                        <option value='리그앙'>리그앙</option>
                    </select>
                </div>
                <ul className={styles.news_list}>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        data &&
                        data.pages.map((page: any) => {
                            return page.data.items.map(
                                (value: news, index: number) => {
                                    return (
                                        <NewsCard key={index} info={value} />
                                    );
                                }
                            );
                        })
                    )}
                </ul>
                {!isLoading && isFetching && <Loading />}

                <div className={styles.button_box}>
                    <button onClick={handleClick}>더보기</button>
                </div>
            </div>
        </div>
    );
}

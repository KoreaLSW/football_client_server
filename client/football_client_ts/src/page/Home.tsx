import { useSelector } from 'react-redux';
import { RootState } from '../App';
import { useQuery } from '@tanstack/react-query';
import { userSessionCheck } from '../api/server';
import { useDispatch } from 'react-redux';
import { login } from '../redux/provider';
import styles from './Home.module.css';
import useHome from '../hooks/useHome';
import React, { useEffect, useState } from 'react';
import { MdContentCopy } from 'react-icons/md';
import { AiOutlineTrophy, AiOutlineVideoCamera } from 'react-icons/ai';
import { BiNews } from 'react-icons/bi';
import { HomeCommunityCard } from '../component/home/HomeCommunityCard';
import {
    communityRead,
    footBallVideo,
    footballOption,
    news,
    standings,
} from '../type/type';
import { HomeFootBallStandingsCard } from '../component/home/HomeFootBallStandingsCard';
import { Loading } from '../component/loading/Loading';
import { HomeNewsCard } from '../component/home/HomeNewsCard';
import { HomeVideoCard } from '../component/home/HomeVideoCard';
import { Modal } from '../component/modal/Modal';
import { Link } from 'react-router-dom';
import { ErrorPage } from './ErrorPage';

type userInfo = {
    id: string | undefined;
    pw: string | undefined;
    email: string | undefined;
    nickname: string | undefined;
    img: string | undefined;
    logintype: string | undefined;
};

type leagueInfo = {
    leagueCode: string;
    name: string;
};

localStorage.setItem('page', '1');
localStorage.setItem('firstPage', '0');
localStorage.setItem('lastPage', '5');
localStorage.setItem('sort', 'community_date');
localStorage.setItem('search', '');
localStorage.setItem('searchOption', 'community_title');

export function Home() {
    const { data: sessionUser } = useQuery(['userInfo'], userSessionCheck, {
        staleTime: 1000 * 60,
    });

    sessionUser && console.log('홈', sessionUser);

    const [community, setCommunity] = useState<any>();
    const [standings, setStandings] = useState<any>();
    const [video, setVideo] = useState<any>();
    const [news, setNews] = useState<any>();
    const [modalType, setModalType] = useState<boolean>(false);
    const [videoId, setVideoId] = useState<string>('');
    const [videoError, setVideoError] = useState<any>('');
    const [leagueInfo, setLeagueInfo] = useState<leagueInfo[]>([
        {
            leagueCode: 'PL',
            name: '프리미어리그',
        },
        {
            leagueCode: 'PD',
            name: '프리메라리가',
        },
        { leagueCode: 'SA', name: '세리에' },
        { leagueCode: 'BL1', name: '분데스리가' },
        { leagueCode: 'FL1', name: '리그앙' },
    ]);

    const [option, setOption] = useState<footballOption>({
        leagueCode: 'PL',
        season: '2022',
    });
    const [newOption, setNewOption] = useState('프리미어리그');
    const [videoOption, setVideoOption] = useState('프리미어리그');

    const {
        community: {
            data: community_list,
            error: c_error,
            isLoading: c_loading,
        },
        homeStandings: {
            data: standings_list,
            error: s_error,
            isLoading: s_loading,
        },
        homeVideo: { data: video_list, error: v_error, isLoading: v_loading },
        homeNews: { data: news_list, error: n_error, isLoading: n_loading },
    } = useHome(option, newOption, videoOption);

    useEffect(() => {
        setCommunity(community_list);
    }, [community_list]);

    useEffect(() => {
        setStandings(standings_list);
    }, [standings_list]);

    useEffect(() => {
        setVideo(video_list);
    }, [video_list]);

    useEffect(() => {
        setNews(news_list);
    }, [news_list]);

    useEffect(() => {
        setVideoError(v_error);
    }, [v_error]);

    const handleOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOption((res) => ({ ...res, [name]: value }));
    };

    const handleNewsOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewOption(e.target.value);
    };

    const handleVideoOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setVideoOption(e.target.value);
    };

    const handleModal = (id: string) => {
        setVideoId(id);
        setModalType(true);
    };

    return (
        <div className={styles.home}>
            <img
                className={styles.bg}
                src='https://res.cloudinary.com/dsopqs4i6/image/upload/v1683151776/banner/Leicester_City_uenqte.jpg'
                alt=''
            />
            <div className={styles.banner_box}></div>
            <div className={styles.home_container}>
                <div className={styles.top_box}>
                    <div className={styles.community_box}>
                        <div className={styles.title_box}>
                            <h2>축구 게시판</h2>
                            <Link to='/Community'>
                                <p>
                                    <MdContentCopy />
                                </p>
                            </Link>
                        </div>
                        {community &&
                            community.data.map(
                                (value: communityRead, index: number) => {
                                    return (
                                        <ul key={index}>
                                            <HomeCommunityCard info={value} />
                                        </ul>
                                    );
                                }
                            )}
                    </div>
                    <div className={styles.standings_box}>
                        <div className={styles.title_box}>
                            <div className={styles.title_option}>
                                <h2>축구 순위</h2>
                                <select
                                    className={styles.leaguecode_select}
                                    name='leagueCode'
                                    onChange={handleOption}
                                >
                                    {leagueInfo &&
                                        leagueInfo.map((value, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={value.leagueCode}
                                                >
                                                    {value.name}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>

                            <Link to='/FootballInfo'>
                                <p>
                                    <AiOutlineTrophy />
                                </p>
                            </Link>
                        </div>
                        {s_loading ? (
                            <Loading />
                        ) : (
                            standings &&
                            standings.data.standings[0].table.map(
                                (value: standings, index: number) => {
                                    if (index < 5) {
                                        return (
                                            <ul key={index}>
                                                <HomeFootBallStandingsCard
                                                    info={value}
                                                />
                                            </ul>
                                        );
                                    }
                                }
                            )
                        )}
                    </div>
                </div>
                <div className={styles.bottom_box}>
                    <div className={styles.video_box}>
                        <div className={styles.title_box}>
                            <div className={styles.title_option}>
                                <h2>축구 영상</h2>
                                <select
                                    className={styles.leaguecode_select}
                                    name='leagueCode'
                                    onChange={handleVideoOption}
                                >
                                    {leagueInfo &&
                                        leagueInfo.map((value, index) => {
                                            return (
                                                <option
                                                    value={value.name}
                                                    key={index}
                                                >
                                                    {value.name}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <Link to='/FootballVideo'>
                                <p>
                                    <AiOutlineVideoCamera />
                                </p>
                            </Link>
                        </div>
                        {v_loading ? (
                            <Loading />
                        ) : (
                            video &&
                            video.data.items.map(
                                (value: footBallVideo, index: number) => {
                                    if (index < 5) {
                                        return (
                                            <ul key={index}>
                                                <HomeVideoCard
                                                    info={value}
                                                    callback={handleModal}
                                                />
                                            </ul>
                                        );
                                    }
                                }
                            )
                        )}
                    </div>
                    <div className={styles.news_box}>
                        <div className={styles.title_box}>
                            <div className={styles.title_option}>
                                <h2>축구 뉴스</h2>
                                <select
                                    className={styles.leaguecode_select}
                                    name='leagueCode'
                                    onChange={handleNewsOption}
                                >
                                    {leagueInfo &&
                                        leagueInfo.map((value, index) => {
                                            return (
                                                <option
                                                    value={value.name}
                                                    key={index}
                                                >
                                                    {value.name}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>

                            <Link to='/FootballNews'>
                                <p>
                                    <BiNews />
                                </p>
                            </Link>
                        </div>
                        {n_loading ? (
                            <Loading />
                        ) : (
                            news &&
                            news.data.items.map(
                                (value: news, index: number) => {
                                    if (index < 5) {
                                        return (
                                            <ul key={index}>
                                                <HomeNewsCard info={value} />
                                            </ul>
                                        );
                                    }
                                }
                            )
                        )}
                    </div>
                </div>
            </div>
            {modalType && (
                <Modal videoId={videoId} setModalType={setModalType} />
            )}
        </div>
    );
}

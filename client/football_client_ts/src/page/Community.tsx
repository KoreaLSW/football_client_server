import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useCommunity from '../hooks/useCommunity';
import { CommunityCard } from '../component/community/CommunityCard';
import styles from './Community.module.css';
import { BsFillPencilFill } from 'react-icons/bs';
import { useQuery } from '@tanstack/react-query';
import { Pagination } from '../component/community/Pagination';
import {
    communityRead as communityReadType,
    communitySelect,
} from '../type/type';
import { communityRead, userSessionCheck } from '../api/server';

export function Community() {
    const { data: sessionUser } = useQuery(['userInfo'], userSessionCheck, {
        staleTime: 1000 * 60,
    });
    const movePage = useNavigate();

    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    const [firstPage, setFirstPage] = useState<number>(0);
    const [lastPage, setLastPage] = useState<number>(5);

    const offset = (page - 1) * limit;

    const [selectValue, setSelectValue] = useState<communitySelect>({
        sort: 'community_date',
        search: '',
        searchOption: 'community_title',
    });

    useEffect(() => {
        const sort = localStorage.getItem('sort');
        const search = localStorage.getItem('search');
        const searchOption = localStorage.getItem('searchOption');

        const local_page = Number(localStorage.getItem('page'));
        const local_firstPage = Number(localStorage.getItem('firstPage'));
        const local_lastPage = Number(localStorage.getItem('lastPage'));
        ////console.log('zzz', sort);
        if (sort !== null) {
            setSelectValue((res) => ({ ...res, sort }));
        }
        if (search !== null) {
            setSelectValue((res) => ({ ...res, search }));
        }
        if (searchOption !== null) {
            setSelectValue((res) => ({ ...res, searchOption }));
        }
        if (local_page !== null) {
            setPage(local_page);
        }
        if (local_firstPage !== null) {
            setFirstPage(local_firstPage);
        }
        if (local_lastPage !== null) {
            setLastPage(local_lastPage);
        }
    }, []);

    //const user = useSelector((state: any) => state.userInfo.User);

    const { data: communityList } = useQuery(
        ['community', selectValue],
        () => communityRead(selectValue),
        {
            refetchOnWindowFocus: false,
        }
    );

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        localStorage.setItem(name, value);
        setSelectValue((res) => ({ ...res, [name]: value }));
    };

    const handleSearchSelet = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        localStorage.setItem(name, value);
        setSelectValue((res) => ({ ...res, [name]: value }));
    };

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        localStorage.setItem(name, value);
        setSelectValue((res) => ({ ...res, [name]: value }));
    };

    const handleInsert = () => {
        if (sessionUser?.id) {
            movePage('/Community/CommunityWrite');
        } else {
            movePage('/Login');
        }
    };

    //console.log('communityList', communityList && communityList);
    return (
        <div className={styles.community}>
            <div className={styles.community_container}>
                <div className={styles.title_box}>
                    <button className={styles.button} onClick={handleInsert}>
                        <BsFillPencilFill />
                        <span>글쓰기</span>
                    </button>
                    <h1 className={styles.title}>커뮤니티</h1>

                    <div className={styles.right_box}>
                        <select
                            name='sort'
                            onChange={handleSelect}
                            value={selectValue.sort}
                        >
                            <option value='community_date'>날짜순</option>
                            <option value='community_commend'>추천순</option>
                            <option value='community_view'>조회수</option>
                        </select>
                        <form className={styles.form}>
                            <input
                                name='search'
                                value={selectValue.search ?? ''}
                                type='text'
                                onChange={handleSearchInput}
                                placeholder='검색어를 입력해주세요.'
                            />
                            <select
                                name='searchOption'
                                onChange={handleSearchSelet}
                                value={selectValue.searchOption}
                            >
                                <option value='community_title'>제목</option>
                                <option value='user_nickname'>작성자</option>
                            </select>
                        </form>
                    </div>
                </div>
                <div className={styles.community_list}>
                    <div className={styles.community_menubar}>
                        <span className={styles.title}>제목</span>
                        <span className={styles.user}>작성자</span>
                        <span className={styles.date}>등록일</span>
                        <span className={styles.views}>조회수</span>
                        <span className={styles.thumb}>추천</span>
                    </div>
                    {communityList &&
                        communityList.data
                            .slice(offset, offset + limit)
                            .map((value: communityReadType, index: number) => {
                                return (
                                    <ul key={index}>
                                        <CommunityCard data={value} />
                                    </ul>
                                );
                            })}

                    <Pagination
                        total={
                            communityList && communityList.data === undefined
                                ? 0
                                : communityList && communityList.data.length
                        }
                        limit={limit}
                        page={page}
                        firstPage={firstPage}
                        lastPage={lastPage}
                        setPage={setPage}
                        setLastPage={setLastPage}
                        setFirstPage={setFirstPage}
                    ></Pagination>
                </div>
            </div>
        </div>
    );
}

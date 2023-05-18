import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { LoginButton } from './LoginButton';
import { User } from './User';
import { userSessionCheck } from '../../api/server';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/provider';
import React, { useEffect, useState } from 'react';

type userInfo = {
    img: string | undefined;
    id: string;
    pw: string;
    email: string;
    nickname: string;
};

export function Navbar() {
    const [scroll, setScroll] = useState<boolean>(true);
    const [mobileCheck, setMobileCheck] = useState<boolean>(true);
    const [click, setClick] = useState<boolean>(false);
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const { data: sessionUser } = useQuery(['userInfo'], userSessionCheck, {
        staleTime: 1000 * 60,
    });

    useEffect(() => {
        if (size.width < 764) {
            setMobileCheck(false);
        } else {
            setMobileCheck(true);
        }
    }, [size]);

    const dispatch = useDispatch();
    if (sessionUser) {
        dispatch(login(sessionUser));
    }

    const handleScroll = () => {
        // 스크롤이 Top에서 50px 이상 내려오면 true값을 useState에 넣어줌
        if (window.pageYOffset === 0) {
            setScroll(() => true);
        } else {
            // 스크롤이 50px 미만일경우 false를 넣어줌
            setScroll(() => false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll); //clean up
        };
    }, []);

    const handleResize = () => {
        if (window.innerWidth < 764) {
            setMobileCheck(false);
        } else {
            setMobileCheck(true);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize); //clean up
        };
    }, []);

    const handleClick = () => {
        if (click) {
            setClick(!click);
        } else {
            setClick(!click);
        }
    };
    return (
        <div className={styles.navbar}>
            <div className={styles.navbar_container}>
                <div className={styles.logo}>
                    <Link to='/'>
                        <img src='/image/logo.png' alt='logo' />
                    </Link>
                </div>
                <div className={styles.mobile_menu} onClick={handleClick}>
                    <img
                        src={click ? '/image/cancel.png' : '/image/menu.png'}
                        alt=''
                    />
                </div>
                <ul
                    className={`${styles.menu_list} ${
                        click ? styles.menu_in : styles.menu_out
                    } `}
                >
                    <li className={styles.list_item} onClick={handleClick}>
                        <Link to='/'> 홈</Link>
                    </li>
                    <li className={styles.list_item} onClick={handleClick}>
                        <Link to='/FootballVideo'> 축구영상</Link>
                    </li>
                    <li className={styles.list_item} onClick={handleClick}>
                        <Link to='/FootballNews'> 축구뉴스</Link>
                    </li>
                    <li className={styles.list_item} onClick={handleClick}>
                        <Link to='/FootballInfo'> 리그 정보</Link>
                    </li>
                    <li className={styles.list_item} onClick={handleClick}>
                        <Link to='/Community'> 커뮤니티</Link>
                    </li>
                    {!mobileCheck && (
                        <li className={styles.list_item}>
                            {sessionUser && sessionUser.nickname ? (
                                <User
                                    session={sessionUser}
                                    setMobileCheck={setClick}
                                />
                            ) : (
                                <LoginButton setMobileCheck={setClick} />
                            )}
                        </li>
                    )}
                </ul>
                {mobileCheck && (
                    <div>
                        {sessionUser && sessionUser.nickname ? (
                            <User
                                session={sessionUser}
                                setMobileCheck={setClick}
                            />
                        ) : (
                            <LoginButton setMobileCheck={setClick} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

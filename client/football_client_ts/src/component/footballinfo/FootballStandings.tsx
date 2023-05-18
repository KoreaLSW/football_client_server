import axios from 'axios';
import { footBallDataStandings } from '../../api/server';
import { useEffect, useState } from 'react';
import useFootballAPI from '../../hooks/useFootballAPI';
import { FootballStandingsCard } from './FootballStandingsCard';
import styles from './FootballStandings.module.css';
import { useQuery } from '@tanstack/react-query';
import { Loading } from '../loading/Loading';
import { footballOption, standings } from '../../type/type';
interface Props {
    info: footballOption;
}

export function FootballStandings({ info }: Props) {
    const {
        football_standings: { data: standings, error, isLoading },
    } = useFootballAPI(info);

    const [data, setData] = useState<any>();

    // useEffect(() => {
    //     axios.get('./data/standings.json').then((res) => {
    //         setData(res.data.standings[0].table);
    //     });
    // }, []);

    //standings && console.log(standings.data.standings[0].table);
    error && alert('1분뒤에 다시 시도해주세요...');

    return (
        <div className={styles.standing}>
            <h2 className={styles.title}>리그 랭킹</h2>
            <ul className={styles.menu}>
                <li className={styles.menu_item}>순위</li>
                <li className={styles.menu_item}>팀</li>
                <li className={styles.menu_item}>경기 수</li>
                <li className={styles.menu_item}>승점</li>
                <li className={styles.menu_item}>승</li>
                <li className={styles.menu_item}>무</li>
                <li className={styles.menu_item}>패</li>
                <li className={styles.menu_item}>득점</li>
                <li className={styles.menu_item}>실점</li>
                <li className={styles.menu_item}>득실</li>
            </ul>
            <ul className={styles.team_list}>
                {isLoading ? (
                    <Loading />
                ) : (
                    standings &&
                    standings.data.standings[0].table.map(
                        (value: standings, index: number) => {
                            return (
                                <FootballStandingsCard
                                    key={index}
                                    info={value}
                                />
                            );
                        }
                    )
                )}
            </ul>

            {/* <ul className={styles.team_list}>
                {data &&
                    data.map((value: standings, index: number) => {
                        return (
                            <FootballStandingsCard key={index} info={value} />
                        );
                    })}
            </ul> */}
        </div>
    );
}

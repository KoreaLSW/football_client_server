import axios from 'axios';
import { useEffect, useState } from 'react';
import { FootballStandingsCard } from './FootballStandingsCard';
import { FootballPlayerCard } from './FootballPlayerCard';
import styles from './FootballPlayer.module.css';
import useFootballAPI from '../../hooks/useFootballAPI';
import { Loading } from '../loading/Loading';
import { Score, footballOption } from '../../type/type';

interface Props {
    info: footballOption;
}

export function FootballPlayer({ info }: Props) {
    const {
        football_player: { data: player, error, isLoading },
    } = useFootballAPI(info);

    //const [data, setData] = useState<any>();

    useEffect(() => {
        axios.get('./data/player.json').then((res) => {
            //setData(res.data.scorers);
            //console.log(res.data.scorers);
        });
    }, []);
    //player && console.log('플레이어', player);

    return (
        <div className={styles.footballplayer}>
            <h2 className={styles.title}>득정순위</h2>
            <ul className={styles.menu_list}>
                <li>순위</li>
                <li>이름</li>
                <li>생년월일</li>
                <li>팀</li>
                <li>골(PK)</li>
                <li>어시스트</li>
            </ul>
            <ul className={styles.playerlist}>
                {isLoading ? (
                    <Loading />
                ) : (
                    player &&
                    player.data.scorers.map((value: Score, index: number) => {
                        return (
                            <FootballPlayerCard
                                key={index}
                                info={value}
                                ranking={index}
                            />
                        );
                    })
                )}
            </ul>

            {/* <ul className={styles.playerlist}>
                {data &&
                    data.map((value: Score, index: number) => {
                        return (
                            <FootballPlayerCard
                                key={index}
                                info={value}
                                ranking={index}
                            />
                        );
                    })}
            </ul> */}
        </div>
    );
}

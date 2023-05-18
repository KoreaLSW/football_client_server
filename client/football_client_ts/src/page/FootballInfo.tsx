import { FootballStandings } from '../component/footballinfo/FootballStandings';
import useFootballAPI from '../hooks/useFootballAPI';
import { useEffect, useState } from 'react';
import styles from './FootballInfo.module.css';
import { FootballPlayer } from '../component/footballinfo/FootballPlayer';
import { footballOption } from '../type/type';

type leagueInfo = {
    leagueCode: string;
    name: string;
};

export function FootballInfo() {
    const [leagueInfo, setLeagueInfo] = useState<leagueInfo[]>([
        {
            leagueCode: 'PL',
            name: '프리미어리그',
        },
        {
            leagueCode: 'PD',
            name: '프리메라리그',
        },
        { leagueCode: 'SA', name: '세리에 A' },
        { leagueCode: 'BL1', name: '분데스리가' },
        { leagueCode: 'FL1', name: '리그 1' },
    ]);
    const [season, setSeason] = useState([
        {
            year: '2022',
        },
        {
            year: '2021',
        },
        {
            year: '2020',
        },
    ]);
    const [option, setOption] = useState<footballOption>({
        leagueCode: 'PL',
        season: '2022',
    });

    const handleOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOption((res) => ({ ...res, [name]: value }));
    };

    return (
        <div className={styles.footballinfo}>
            <div className={styles.footballinfo_container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>리그정보</h1>
                    <select
                        className={styles.leaguecode_select}
                        name='leagueCode'
                        onChange={handleOption}
                    >
                        {leagueInfo &&
                            leagueInfo.map((value, index) => {
                                return (
                                    <option
                                        value={value.leagueCode}
                                        key={index}
                                    >
                                        {value.name}
                                    </option>
                                );
                            })}
                    </select>
                    <select
                        className={styles.season_select}
                        name='season'
                        onChange={handleOption}
                    >
                        {season &&
                            season.map((value, index) => {
                                return (
                                    <option value={value.year} key={index}>
                                        {value.year}
                                    </option>
                                );
                            })}
                    </select>
                </div>
                <FootballStandings info={option} />
                <FootballPlayer info={option} />
            </div>
        </div>
    );
}

import { useQuery } from '@tanstack/react-query';
import {
    footBallDataAreas,
    footBallDataPlayer,
    footBallDataStandings,
} from '../api/server';
import { footballOption } from '../type/type';

export default function useFootballAPI(info: footballOption) {
    // const football_areas = useQuery(['footBall'], () => footBallDataAreas(), {
    //     refetchOnWindowFocus: false,
    // });

    const football_standings = useQuery(
        ['footBall', info],
        () => footBallDataStandings(info),
        {
            refetchOnWindowFocus: false,
            retry: 1,
        }
    );

    const football_player = useQuery(
        ['footBallPlayer', info],
        () => footBallDataPlayer(info),
        {
            refetchOnWindowFocus: false,
            retry: 1,
        }
    );

    return { football_standings, football_player };
}

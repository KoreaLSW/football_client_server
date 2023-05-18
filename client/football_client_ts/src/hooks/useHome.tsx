import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    footBallDataStandings,
    footBallNews,
    footBallVideo,
    homeCommunity,
} from '../api/server';
import { footballOption } from '../type/type';

export default function useHome(
    option: footballOption,
    newOption: string,
    videoOption: string
) {
    const queryClient = useQueryClient();

    const community = useQuery(['homeCommunity'], () => homeCommunity(), {
        refetchOnWindowFocus: false,
    });

    const homeStandings = useQuery(
        ['homeFootball', option],
        () => footBallDataStandings(option),
        {
            refetchOnWindowFocus: false,
            retry: 1,
        }
    );

    const homeVideo = useQuery(
        ['homeVideo', videoOption],
        () => footBallVideo('', videoOption),
        {
            refetchOnWindowFocus: false,
            retry: 1,
        }
    );

    const homeNews = useQuery(
        ['homeNews', newOption],
        () => footBallNews(newOption, '1'),
        {
            refetchOnWindowFocus: false,
            retry: 1,
        }
    );

    return { community, homeStandings, homeVideo, homeNews };
}

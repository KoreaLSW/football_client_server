import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from '@tanstack/react-query';
import {
    commentRead,
    commentWrite,
    communityCommendPlus,
    communityDelete,
    communityRead,
    communityReadDetail,
    communityUpdate,
    communityViewPlus,
    communityWrite,
    singUp,
    userNickNameCheck,
} from '../api/server';
import {
    commentWrite as commentWriteType,
    communityWrite as communityWriteType,
    community_CRUD,
} from '../type/type';

export default function useCommunity(no?: string) {
    const queryClient = useQueryClient();

    const readDetail = useQuery(
        ['community', no],
        () => communityReadDetail(no),
        {
            refetchOnWindowFocus: false,
        }
    );

    const comment = useQuery(['comment', no], () => commentRead(no), {
        refetchOnWindowFocus: false,
    });

    const write = useMutation(
        (community: communityWriteType) => communityWrite(community),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['community']);
            },
        }
    );

    const commentInsert = useMutation(
        (comment: commentWriteType) => commentWrite(comment),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['community', no]);
            },
        }
    );

    const update = useMutation(
        (updateInfo: { community: communityWriteType; info: community_CRUD }) =>
            communityUpdate(updateInfo),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['community']);
            },
        }
    );

    const remove = useMutation(
        (info: { no: string; id: string }) => communityDelete(info),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['community']);
            },
        }
    );

    const viewPlus = useMutation((no: string) => communityViewPlus(no), {
        onSuccess: () => {
            queryClient.invalidateQueries(['community']);
        },
    });

    const commendPlus = useMutation(
        (info: { no: string; id: string }) => communityCommendPlus(info),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['community']);
            },
        }
    );

    return {
        readDetail,
        comment,
        write,
        commentInsert,
        update,
        remove,
        viewPlus,
        commendPlus,
    };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { singUp, userIdCheck, userNickNameCheck } from '../api/server';

type userInfo = {
    id: string;
    pw: string;
    email: string;
    nickname: string;
    img: string;
    logintype: string;
};

export default function useSingUp(userId?: string, nickName?: string) {
    const queryClient = useQueryClient();

    const idCheck = useQuery(
        ['singUp', userId || ''],
        () => userIdCheck(userId),
        {
            enabled: !!userId,
        }
    );

    const nickNameCheck = useQuery(
        ['singUp', nickName || ''],
        () => userNickNameCheck(nickName),
        {
            enabled: !!nickName,
        }
    );

    const singUphook = useMutation((user: userInfo) => singUp(user), {
        onSuccess: () => {
            queryClient.invalidateQueries(['singUp']);
        },
    });

    return { idCheck, nickNameCheck, singUphook };
}

import { useLocation } from 'react-router-dom';
import { ImgUpdate } from '../component/userupdate/ImgUpdate';
import { InfoUpdate } from '../component/userupdate/InfoUpdate';
import { useQuery } from '@tanstack/react-query';
import { userSessionCheck } from '../api/server';

type userInfo = {
    img: string | undefined;
    id: string;
    pw: string;
    email: string;
    nickname: string;
};

export function UserInfoUpdate() {
    const location = useLocation();
    const key = location.state.key;
    const { data: user } = useQuery(['userInfo'], () => userSessionCheck(), {
        refetchOnWindowFocus: false,
    });

    return (
        <div>
            {key && key === 'img'
                ? user && <ImgUpdate user={user} />
                : user && <InfoUpdate user={user} />}
        </div>
    );
}

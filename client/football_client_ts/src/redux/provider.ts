const LOGIN = 'LOGIN' as const;
const LOGOUT = 'LOGOUT' as const;

type LoginAction = ReturnType<typeof login> | ReturnType<typeof logout>;

type UserInfoState = {
    User: {
        id: string;
        nickname: string;
        img: string;
        email: string;
        logintype: string;
    };
};

const initialState: UserInfoState = {
    User: {
        id: '',
        nickname: '',
        img: '',
        email: '',
        logintype: '',
    },
};

export const login = (user: any) => ({ type: LOGIN, payload: user });
export const logout = () => ({ type: LOGOUT });

function userInfo(state = initialState, action: LoginAction) {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                User: {
                    ...state.User,
                    id: action.payload.id,
                    nickname: action.payload.nickname,
                    img: action.payload.img,
                    email: action.payload.email,
                    logintype: action.payload.logintype,
                },
            };
        case LOGOUT:
            return {
                ...state,
                User: {
                    id: '',
                    email: '',
                    img: '',
                    nickname: '',
                },
            };

        default:
            return state;
    }
}

export default userInfo;

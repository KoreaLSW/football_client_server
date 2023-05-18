import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import axios from 'axios';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

type userInfo = {
    id: string | null;
    pw: string | null;
    email: string | null;
    nickname: string | null;
    img: string | null;
    logintype: string | null;
};

export async function gitsingup() {
    const url = '/api/singup';
    return signInWithPopup(auth, provider)
        .then((result) => {
            const user: userInfo = {
                id: result.user.email,
                pw: '',
                email: result.user.email,
                nickname: result.user.displayName,
                img: result.user.photoURL,
                logintype: 'google',
            };

            return axios.post(url, user);
        })
        .catch(console.error);
}

export async function googlelogin() {
    const url = '/api/google/googlelogin';
    // return signInWithPopup(auth, provider)
    //     .then((result) => {
    //         const user: userInfo = {
    //             id: result.user.email,
    //             pw: '',
    //             email: '',
    //             nickname: '',
    //             img: '',
    //             logintype: '',
    //         };
    //         console.log('깃로그인', user.id);

    //         return axios.post(url, { id: user.id, pw: user.pw });
    //     })
    //     .catch(console.error);
    return axios.get(url);
}

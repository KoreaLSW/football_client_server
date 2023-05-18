import axios from 'axios';
import {
    commentWrite as commentWriteType,
    communitySelect,
    communityWrite as communityWriteType,
    community_CRUD,
    footballOption,
    userInfo,
} from '../type/type';

const PROXY =
    window.location.hostname === 'localhost'
        ? ''
        : 'http://leicestercity.store:8001';

export async function singUp(user: userInfo) {
    const url: string = `${PROXY}/api/singup`;
    return axios.post(url, user);
}

//axios.defaults.withCredentials = true;

export async function userIdCheck(userId: string | undefined) {
    const url: string = `${PROXY}/api/usercheck/` + userId;
    return axios.get(url);
}

// export async function loginCheck(
//     userId: string | undefined,
//     userPw: string | undefined
// ) {
//     const url: string = `${PROXY}/api/login`;

//     return axios.post(url, { id: userId, pw: userPw }).then((result) => {
//         return result;
//     });
// }

export async function loginCheck(
    userId: string | undefined,
    userPw: string | undefined
) {
    const url: string = `${PROXY}/api/login`;

    return axios
        .post(url, { id: userId, pw: userPw }, { withCredentials: true })
        .then((result) => {
            return result;
        });
}

export async function logout() {
    const url: string = `${PROXY}/api/logout`;
    return axios.get(url);
}

export async function userSessionCheck() {
    console.log('1234');

    const url: string = `${PROXY}/api/sessioncheck`;
    return axios.get(url).then((result) => {
        const user: userInfo = {
            id: result.data[0].user_id,
            pw: result.data[0].user_pw,
            email: result.data[0].user_email,
            nickname: result.data[0].user_nickname,
            img: result.data[0].user_img,
            logintype: result.data[0].user_login_type,
        };
        return user;
    });
}

export async function userImgUpdate(user: userInfo) {
    const url: string = `${PROXY}/api/user/imgupdate`;

    return axios.get(url, { params: { id: user.id, img: user.img } });
}

export async function userPwUpdate(id: string, pw: string) {
    const url: string = `${PROXY}/api/user/pwupdate`;

    return axios.get(url, { params: { id, pw } });
}

export async function userNickNameUpdate(id: string, nickName: string) {
    const url: string = `${PROXY}/api/user/nicknameupdate`;

    return axios.get(url, { params: { id, nickName } });
}

export async function userNickNameCheck(nickName: string | undefined) {
    const url: string = `${PROXY}/api/nicknamecheck/` + nickName;
    return axios.get(url);
}

export async function communityRead(type: communitySelect | undefined) {
    const url: string = `${PROXY}/api/community/read/list`;

    return axios.get(url, { params: { type } });
}

export async function communityReadDetail(no: string | undefined) {
    const url: string = `${PROXY}/api/community/read/detail`;
    return axios.get(url, { params: { no } });
}

export async function commentRead(no: string | undefined) {
    const url: string = `${PROXY}/api/community/comment/read/detail`;
    return axios.get(url, { params: { no } });
}

export async function communityWrite(community: communityWriteType) {
    const url: string = `${PROXY}/api/community/write`;
    return axios.post(url, community);
}

export async function commentWrite(comment: commentWriteType) {
    const url: string = `${PROXY}/api/community/comment/write`;
    return axios.post(url, comment);
}

export async function communityUpdate(updateInfo: {
    community: communityWriteType;
    info: community_CRUD;
}) {
    const url: string = `${PROXY}/api/community/update`;
    return axios.post(url, updateInfo);
}

export async function communityDelete(info: community_CRUD) {
    //console.log('info', info);

    const no = info.no;
    const id = info.id;

    const url: string = `${PROXY}/api/community/delete`;
    return axios.get(url, { params: { no, id } });
}

export async function communityViewPlus(no: string) {
    const url: string = `${PROXY}/api/community/viewsplus`;
    return axios.get(url, { params: { no } });
}

export async function communityCommendPlus(info: community_CRUD) {
    //console.log('nnoo', info.no);
    const no = info.no;
    const id = info.id;

    const url: string = `${PROXY}/api/community/commendplus`;
    return axios.get(url, { params: { no, id } });
}

export async function uploadImage(file: File, id: string, type: string) {
    const preset: any = process.env.REACT_APP_CLOUDINARY_PRESET;
    const url: any = process.env.REACT_APP_CLOUDINARY_URL;

    const fileExtension = file.name.split('.')[1];

    const oldFile: File = file;
    let newFile: File = new File([], '');

    switch (fileExtension) {
        case 'jpg': //jpg일 경우
            newFile = new File([oldFile], `${id}_${type}.jpg`, {
                type: oldFile.type,
            }); // File생성자를 이용해서 oldFile의 이름을 바꿔준다
            break;
        case 'png':
            newFile = new File([oldFile], `${id}_${type}.png`, {
                type: oldFile.type,
            });
            break;
        default:
            alert('지원하지 않는 파일 형식입니다.');
            break;
    }

    const data = new FormData();
    data.append('file', newFile);
    data.append('upload_preset', preset);
    if (type === 'profile') {
        data.append('folder', `user/${id}/profile`);
    } else {
        data.append('folder', `user/${id}/community`);
    }

    return fetch(url, {
        method: 'POST',
        body: data,
    }) //
        .then((res) => res.json())
        .then((data) => data.url);
}

export async function footBallDataAreas() {
    const url: string = `${PROXY}/api/footballdata/areas`;
    return axios.get(url);
}

export async function footBallDataStandings(info: footballOption) {
    //console.log('info', info);

    const url: string = `${PROXY}/api/footballdata/standings`;
    const leagueCode = info.leagueCode;
    const season = info.season;
    return axios.get(url, { params: { leagueCode, season } });
}

export async function footBallDataPlayer(info: footballOption) {
    //console.log('info', info);

    const url: string = `${PROXY}/api/footballdata/player`;
    const leagueCode = info.leagueCode;
    const season = info.season;
    return axios.get(url, { params: { leagueCode, season } });
}

export async function footBallNews(search: string, page: string) {
    //console.log('search', search, 'page', page);
    const url: string = `${PROXY}/api/footballdata/news`;
    return axios.get(url, { params: { search, page } });
}

export async function footBallVideo(token: string, keyword: string) {
    //console.log('token', token);
    //console.log('keyword', process.env.REACT_APP_YOUTUBE_API_KEY);

    const YOUTUBE_URL = 'https://www.googleapis.com/youtube/v3';
    return axios.get(`${YOUTUBE_URL}/search`, {
        params: {
            key: process.env.REACT_APP_YOUTUBE_API_KEY,
            part: 'snippet',
            maxResults: 25,
            type: 'video',
            pageToken: token && token,
            q: keyword,
        },
    });

    //return axios.get('/videos/related.json');
}

export async function homeCommunity() {
    const url: string = `${PROXY}/api/home/community`;
    return axios.get(url);
}

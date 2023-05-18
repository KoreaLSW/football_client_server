export type community_CRUD = {
    no: string;
    id: string;
};

export type userInfo = {
    id: string;
    pw: string;
    email: string;
    nickname: string;
    img: string;
    logintype: string;
};

export type communityWrite = {
    id: string;
    title: string;
    date: string;
    content: string;
    view: string;
    commend: string;
    img01: string | undefined;
    img02: string | undefined;
    img03: string | undefined;
    img04: string | undefined;
    img05: string | undefined;
};

export type communityRead = {
    community_no: string;
    user_id: string;
    user_nickname: string;
    user_img: string | undefined;
    community_title: string;
    community_date: string;
    community_content: string;
    community_view: string;
    community_commend: string;
    community_img_01: string | undefined;
    community_img_02: string | undefined;
    community_img_03: string | undefined;
    community_img_04: string | undefined;
    community_img_05: string | undefined;
};

export type footballOption = {
    leagueCode: string;
    season: string;
};

export type communitySelect = {
    sort: string;
    search: string;
    searchOption: string;
};

export interface standings {
    playedGames: string; // 경기 수
    won: string; // 승
    draw: string; // 무
    lost: string; // 패
    points: string; //승점
    goalsFor: string; // 득점
    goalsAgainst: string; // 실점
    goalDifference: string; // 득실
    position: string; // 순위
    form: string; // 최근 5경기
    team: teamInfo;
}

interface teamInfo {
    id: string; // 클럽 아이디
    name: string; // 클럽 이름
    shortName: string; // 클럽 짧은 이름
    tla: string; // 클럽 이니셜
    crest: string; // 클럽 마크
}

export interface Score {
    playedMatches: string; // 경기수
    goals: string; // 득점
    assists: string; // 어시스트
    penalties: string; // 패널트킥 득점
    player: Player;
    team: Team;
}

interface Player {
    id: string; // 선수 아이디
    name: string; // 이름
    dateOfBirth: string; // 생년월일
    lastUpdated: string; // 마지막 업데이트
    nationality: string; // 국적
}

interface Team {
    id: string; // 팀아이디
    name: string; // 팀이름
    shortName: string; // 팀 짧은 이름
    tla: string; // 팀이니셜
    crest: string; // 팀마크
}

export interface news {
    title: string; // 뉴스 제목
    description: string; //뉴스 내용
    pubDate: string; // 뉴스 날짜
    link: string; // 뉴스 링크
    imgurl: string; // 뉴스 이미지
}

export interface footBallVideo {
    id: {
        videoId: string;
    };
    snippet: {
        channelId: string; // 비디오 아이디
        channelTitle: string; // 비디오 제목
        description: string; // 비디오 내용
        publishedAt: string; // 비디오 날짜
        thumbnails: {
            default: thumbnailsInfo;
            high: thumbnailsInfo;
            medium: thumbnailsInfo;
        }; // 비디오 썸네일
    };
}

export interface thumbnailsInfo {
    height: string;
    url: string; // 비디오 URL
    width: string;
}

export interface commentInfo {
    commend_no: string;
    comment_date: string;
    comment_list_no: number;
    comment_content: string;
    user_email: string;
    user_id: string;
    user_img: string;
    user_login_type: string;
    user_nickname: string;
    user_pw: string;
}

export interface commentWrite {
    commend_no: string;
    comment_date: string;
    comment_content: string;
    user_id: string;
}

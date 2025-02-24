export type UserStatus = 'SIGNED_IN' | 'SIGNED_OUT';

export interface UserStore {
    username: string;
    id: string;
    avatar_url: string;
    bio: string;
    userStatus: UserStatus;
    setUser: (username: string, id: string, avatar_url: string, bio: string, userStatus: UserStatus) => void;
    resetUser: () => void;
  }
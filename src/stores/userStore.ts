import { create } from 'zustand';

type UserStatus = 'SIGNED_IN' | 'SIGNED_OUT';

interface UserStore {
  username: string;
  id: string;
  avatar_url: string;
  userStatus: UserStatus;
  setUser: (username: string, id: string, avatar_url: string, userStatus: UserStatus) => void;
  resetUser: () => void;
}

const useUserStore = create<UserStore>((set) => {
  const storedUserInfo = localStorage.getItem('userInfo');
  const storedAuthToken = localStorage.getItem('authToken');

  if (storedUserInfo) {
    const parsedUserInfo = JSON.parse(storedUserInfo);
    return {
      username: parsedUserInfo.username,
      id: parsedUserInfo.id,
      avatar_url: parsedUserInfo.avatar_url,
      userStatus: storedAuthToken ? 'SIGNED_IN' : 'SIGNED_OUT',
      setUser: (username, id, avatar_url, userStatus) =>
        set(() => ({ username, id, avatar_url, userStatus })),
      resetUser: () =>
        set(() => ({ username: '', id: '', avatar_url: '', userStatus: 'SIGNED_OUT' })),
    };
  }

  return {
    username: '',
    id: '',
    avatar_url: '',
    userStatus: 'SIGNED_OUT',
    setUser: (username, id, avatar_url, userStatus) => set(() => ({ username, id, avatar_url, userStatus })),
    resetUser: () => set(() => ({ username: '', id: '', userStatus: 'SIGNED_OUT' })),
  };
});

export default useUserStore;
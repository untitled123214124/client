import { create } from 'zustand';
import { UserStore } from '@/models/userstore.model';

const useUserStore = create<UserStore>((set) => ({
  username: '',
  id: '',
  avatar_url: '',
  bio: '',
  userStatus: 'SIGNED_OUT',
  setUser: (username, id, avatar_url, bio, userStatus) => set(() => ({ username, id, avatar_url, bio, userStatus })),
  resetUser: () => set(() => ({ username: '', id: '', avatar_url: '', bio: '', userStatus: 'SIGNED_OUT' })),
}));

export default useUserStore;
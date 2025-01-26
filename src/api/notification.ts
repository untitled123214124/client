import axios from "axios"

export const getNotifications = async (userId: string) => {
    try {
      const response = await axios.get('/api/notifications', {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      throw new Error('알림을 가져오는 데 실패했습니다.');
    }
  };
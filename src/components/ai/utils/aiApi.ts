import axiosInstance from '../../../api/axiosInstance';

interface AIChatResponse {
  success: boolean;
  reply: string;
}

export const sendMessageToAI = async (message: string): Promise<string> => {
  const response = await axiosInstance.post<AIChatResponse>('/api/ai/chat', {
    message,
  });

  return response.data.reply;
};

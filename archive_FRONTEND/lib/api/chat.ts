import api from './axios'
import { ENDPOINTS } from './endpoints'

export const chatService = {
  async sendMessage(message: string): Promise<string> {
    const { data } = await api.post(ENDPOINTS.chat.send, { message })
    return data.data.reply
  },
}

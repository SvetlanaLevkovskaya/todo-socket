import { Socket, io } from 'socket.io-client'

import { SOCKET_SERVER_URL } from '@/config/urls'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      reconnection: true,
    })
  }
  return socket
}

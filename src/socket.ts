import { Socket, io } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:3003', {
      transports: ['websocket'],
      reconnection: true,
    })
  }
  return socket
}

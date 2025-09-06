import PocketBase from 'pocketbase'

export const pb = new PocketBase('http://192.168.14.55:8090')
//http://127.0.0.1:8090 мой
//192.168.14.55:8090/_/

pb.autoCancellation(false)

import PocketBase from 'pocketbase'

export const servers = {
	Abdurahim: 'http://127.0.0.1:8090',
	Petr: 'http://192.168.14.55:8090',
} as const

export type ServerName = keyof typeof servers

export let currentServerName: ServerName =
	(localStorage.getItem('currentServerName') as ServerName) || 'Petr'

export const pb = new PocketBase(servers[currentServerName])
pb.autoCancellation(false)

export const switchServer = (serverName: ServerName) => {
	if (servers[serverName]) {
		currentServerName = serverName
		localStorage.setItem('currentServerName', serverName)
		pb.baseUrl = servers[serverName]
		return true
	}
	return false
}

export const getCurrentServer = (): ServerName => currentServerName

export const getAvailableServers = (): ServerName[] =>
	Object.keys(servers) as ServerName[]

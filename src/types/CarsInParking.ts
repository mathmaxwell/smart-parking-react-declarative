export interface ICarsInParking {
	id: string
	entryTime: Date
	entryPhoto: string
	exitTime: Date
	exitPhoto: string
	typeName: string
	plateNumber: string
	isBus: boolean
	enterMomentStamp: number
	exitMomentStamp: number
	exitMomentStampDay: number
	enterMomentStampDay: number
}

export interface IFilterCarsInParking {
	plateNumber: string
}
export interface ICars {
	id: string
	plateNumber: string
	ownerName: string
	type: string
	start_Date: Date
	end_Date: Date
	startMomentStampDay: number
	startMomentStamp: number
	endMomentStampDay: number
	endMomentStamp: number
	expand?: {
		type?: {
			id: string
			display_name: string
		}
	}
}
export interface ICarsType {
	end_Date: Date
	start_Date: Date
	ownerName: string
	plateNumber: string
	startMomentStamp: number
	startMomentStampDay: number
	endMomentStamp: number
	endMomentStampDay: number
	expand: {
		type: {
			display_name: 'whiteList' | 'worker' | 'tenant' | 'bus' | 'others'
			ownerName: string
			plateNumber: string
		}
	}
}
export interface ICarGroup {
	id: string
	display_name: 'others' | 'bus' | 'whiteList' | 'worker' | 'tenant'
	hour: number
	month: number
	day: number
	first2hours: number
	start: number
	end: number
	first10Minutes: number
	from11To59for10: number
	after61: number
	from2Hour:number 
	
}

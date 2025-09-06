export interface ICarsInParking {
	id: string
	entryTime: Date
	entryPhoto: string
	exitTime: Date
	exitPhoto: string
	typeName: string
	plateNumber: string
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
	expand?: {
		type?: {
			id: string
			display_name: string
		}
	}
}

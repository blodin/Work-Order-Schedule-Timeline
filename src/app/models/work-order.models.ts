export type WorkOrderStatus = 'open' | 'in-progress' | 'completed' | 'cancelled';

export interface WorkCenterDocument {
	id: string;
	name: string;
	description?: string;
}

export interface WorkOrderDocument {
	id: string;
	title: string;
	workCenterId: string;
	status: WorkOrderStatus;
	startDate: string; // ISO format YYYY-MM-DD
	endDate: string; // ISO format YYYY-MM-DD
	notes?: string;
}

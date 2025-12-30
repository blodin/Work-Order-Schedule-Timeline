import { WorkOrderDocument, WorkOrderStatus } from './work-order.models';

export type ZoomLevel = 'day' | 'week' | 'month';

export interface TimelineState {
	zoomLevel: ZoomLevel;
	visibleStartDate: Date;
	visibleEndDate: Date;
	today: Date;
}

export interface TimelineHeaderUnit {
	label: string;
	date: Date;
	isToday: boolean;
}

export interface PositionedWorkOrder {
	workOrder: WorkOrderDocument;
	left: number; // percentage
	width: number; // percentage
	visible: boolean;
}

export interface WorkCenterRow {
	id: string;
	name: string;
	orders: PositionedWorkOrder[];
}

export const STATUS_LABELS: Record<WorkOrderStatus, string> = {
	'open': 'Open',
	'in-progress': 'In progress',
	'completed': 'Completed',
	'cancelled': 'Cancelled'
};

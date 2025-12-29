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

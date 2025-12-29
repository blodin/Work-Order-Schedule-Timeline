import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimelineState, ZoomLevel, TimelineHeaderUnit } from '../models/timeline-state.models';

@Component({
	selector: 'app-timeline',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './timeline.component.html',
	styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements OnInit {
	state: TimelineState;
	headerUnits: TimelineHeaderUnit[] = [];

	constructor() {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		this.state = {
			zoomLevel: 'day',
			today,
			visibleStartDate: today,
			visibleEndDate: today,
		};
	}

	ngOnInit(): void {
		this.updateVisibleRange();
	}

	onZoomChange(zoomLevel: ZoomLevel): void {
		this.state.zoomLevel = zoomLevel;
		this.updateVisibleRange();
	}

	private updateVisibleRange(): void {
		const { zoomLevel, today } = this.state;
		const start = new Date(today);
		const end = new Date(today);

		switch (zoomLevel) {
			case 'day':
				start.setDate(today.getDate() - 14);
				end.setDate(today.getDate() + 14);
				break;
			case 'week':
				start.setMonth(today.getMonth() - 2);
				end.setMonth(today.getMonth() + 2);
				break;
			case 'month':
				start.setMonth(today.getMonth() - 6);
				end.setMonth(today.getMonth() + 6);
				break;
		}

		this.state.visibleStartDate = start;
		this.state.visibleEndDate = end;
		this.generateHeaderUnits();
	}

	private generateHeaderUnits(): void {
		const { zoomLevel, visibleStartDate, visibleEndDate, today } = this.state;
		const units: TimelineHeaderUnit[] = [];
		const current = new Date(visibleStartDate);

		while (current <= visibleEndDate) {
			const isToday = this.isSameDay(current, today);

			switch (zoomLevel) {
				case 'day':
					units.push({
						label: this.formatDayLabel(current),
						date: new Date(current),
						isToday,
					});
					current.setDate(current.getDate() + 1);
					break;
				case 'week':
					units.push({
						label: this.formatWeekLabel(current),
						date: new Date(current),
						isToday: this.isInSameWeek(current, today),
					});
					current.setDate(current.getDate() + 7);
					break;
				case 'month':
					units.push({
						label: this.formatMonthLabel(current),
						date: new Date(current),
						isToday: this.isSameMonth(current, today),
					});
					current.setMonth(current.getMonth() + 1);
					break;
			}
		}

		this.headerUnits = units;
	}

	private formatDayLabel(date: Date): string {
		const day = date.getDate();
		const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
		return `${weekday} ${day}`;
	}

	private formatWeekLabel(date: Date): string {
		const month = date.toLocaleDateString('en-US', { month: 'short' });
		const day = date.getDate();
		return `${month} ${day}`;
	}

	private formatMonthLabel(date: Date): string {
		return date.toLocaleDateString('en-US', {
			month: 'short',
			year: 'numeric',
		});
	}

	private isSameDay(a: Date, b: Date): boolean {
		return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
	}

	private isInSameWeek(date: Date, today: Date): boolean {
		const weekStart = new Date(date);
		const weekEnd = new Date(date);
		weekEnd.setDate(weekEnd.getDate() + 6);
		return today >= weekStart && today <= weekEnd;
	}

	private isSameMonth(a: Date, b: Date): boolean {
		return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
	}
}

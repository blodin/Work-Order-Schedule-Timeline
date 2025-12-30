import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	TimelineState,
	ZoomLevel,
	TimelineHeaderUnit,
	PositionedWorkOrder,
	WorkCenterRow,
	STATUS_LABELS,
} from '../models/timeline-state.models';
import { WORK_CENTERS, WORK_ORDERS } from '../data/timeline-data';
import { WorkCenterDocument, WorkOrderDocument } from '../models/work-order.models';

@Component({
	selector: 'app-timeline',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './timeline.component.html',
	styleUrl: './timeline.component.scss',
})
export class TimelineComponent {
	statusLabels = STATUS_LABELS;

	// Core signals
	workCenters = signal<WorkCenterDocument[]>(WORK_CENTERS);
	workOrders = signal<WorkOrderDocument[]>(WORK_ORDERS);
	timelineState = signal<TimelineState>(this.createInitialState());

	// Computed: header units based on zoom level
	headerUnits = computed(() => this.generateHeaderUnits(this.timelineState()));

	// Computed: positioned work orders grouped by work center
	workCenterRows = computed(() => this.calculateWorkCenterRows());

	private createInitialState(): TimelineState {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const start = new Date(today);
		const end = new Date(today);
		start.setDate(today.getDate() - 14);
		end.setDate(today.getDate() + 14);

		return {
			zoomLevel: 'day',
			today,
			visibleStartDate: start,
			visibleEndDate: end,
		};
	}

	onZoomChange(zoomLevel: ZoomLevel): void {
		const current = this.timelineState();
		const { today } = current;
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

		this.timelineState.set({
			...current,
			zoomLevel,
			visibleStartDate: start,
			visibleEndDate: end,
		});
	}

	private generateHeaderUnits(state: TimelineState): TimelineHeaderUnit[] {
		const { zoomLevel, visibleStartDate, visibleEndDate, today } = state;
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

		return units;
	}

	private calculateWorkCenterRows(): WorkCenterRow[] {
		const state = this.timelineState();
		const centers = this.workCenters();
		const orders = this.workOrders();
		const totalDays = this.daysBetween(state.visibleStartDate, state.visibleEndDate);

		return centers.map((wc) => {
			const wcOrders = orders
				.filter((wo) => wo.workCenterId === wc.id)
				.map((wo) => this.positionWorkOrder(wo, state.visibleStartDate, totalDays));

			return {
				id: wc.id,
				name: wc.name,
				orders: wcOrders,
			};
		});
	}

	private positionWorkOrder(order: WorkOrderDocument, rangeStart: Date, totalDays: number): PositionedWorkOrder {
		const orderStart = this.parseDate(order.startDate);
		const orderEnd = this.parseDate(order.endDate);

		const startOffset = this.daysBetween(rangeStart, orderStart);
		const duration = this.daysBetween(orderStart, orderEnd) + 1;

		const left = (startOffset / totalDays) * 100;
		const width = (duration / totalDays) * 100;

		const visible = left + width > 0 && left < 100;

		return {
			workOrder: order,
			left: Math.max(0, left),
			width: Math.min(width, 100 - Math.max(0, left)),
			visible,
		};
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

	private parseDate(dateStr: string): Date {
		const [year, month, day] = dateStr.split('-').map(Number);
		return new Date(year, month - 1, day);
	}

	private daysBetween(start: Date, end: Date): number {
		const msPerDay = 24 * 60 * 60 * 1000;
		return Math.round((end.getTime() - start.getTime()) / msPerDay);
	}
}

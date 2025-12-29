import { WorkCenterDocument, WorkOrderDocument, WorkOrderStatus } from '../models/work-order.models';

export const WORK_ORDER_STATUSES: WorkOrderStatus[] = ['open', 'in-progress', 'completed', 'cancelled'];

export const WORK_CENTERS: WorkCenterDocument[] = [
	{
		id: 'wc-001',
		name: 'Genesis Hardware',
		description: 'Primary hardware assembly line',
	},
	{
		id: 'wc-002',
		name: 'Rodriques Electrics',
		description: 'Electrical systems integration',
	},
	{
		id: 'wc-003',
		name: 'Precision Machining',
		description: 'CNC and precision metal work',
	},
	{
		id: 'wc-004',
		name: 'Summit Fabrication',
		description: 'Sheet metal and welding',
	},
	{
		id: 'wc-005',
		name: 'Apex Quality Control',
		description: 'Final inspection and testing',
	},
];

export const WORK_ORDERS: WorkOrderDocument[] = [
	// Genesis Hardware - multiple orders
	{
		id: 'wo-001',
		title: 'Konsulting Inc',
		workCenterId: 'wc-001',
		status: 'in-progress',
		startDate: '2025-01-02',
		endDate: '2025-01-08',
		notes: 'Priority client order',
	},
	{
		id: 'wo-002',
		title: 'Nexus Components',
		workCenterId: 'wc-001',
		status: 'open',
		startDate: '2025-01-10',
		endDate: '2025-01-15',
	},
	// Rodriques Electrics - multiple orders
	{
		id: 'wo-003',
		title: 'Orion Systems',
		workCenterId: 'wc-002',
		status: 'completed',
		startDate: '2024-12-20',
		endDate: '2024-12-28',
	},
	{
		id: 'wo-004',
		title: 'Titan Industries',
		workCenterId: 'wc-002',
		status: 'in-progress',
		startDate: '2025-01-05',
		endDate: '2025-01-12',
	},
	// Precision Machining
	{
		id: 'wo-005',
		title: 'Vanguard Motors',
		workCenterId: 'wc-003',
		status: 'open',
		startDate: '2025-01-08',
		endDate: '2025-01-18',
		notes: 'Custom machining specs',
	},
	// Summit Fabrication - multiple orders
	{
		id: 'wo-006',
		title: 'Atlas Structures',
		workCenterId: 'wc-004',
		status: 'cancelled',
		startDate: '2025-01-03',
		endDate: '2025-01-07',
	},
	{
		id: 'wo-007',
		title: 'Meridian Steel',
		workCenterId: 'wc-004',
		status: 'in-progress',
		startDate: '2025-01-09',
		endDate: '2025-01-20',
	},
	// Apex Quality Control
	{
		id: 'wo-008',
		title: 'Zenith Electronics',
		workCenterId: 'wc-005',
		status: 'open',
		startDate: '2025-01-06',
		endDate: '2025-01-10',
		notes: 'Requires extended testing',
	},
];

import type { Schedule } from '@myfitness/shared';
interface ScheduleActionsSidebarProps {
    schedule: Schedule | null;
    onCreateSchedule: () => void;
    onEditSchedule: () => void;
    onDeleteSchedule: () => void;
    isDeleting: boolean;
}
export default function ScheduleActionsSidebar({ schedule, onCreateSchedule, onEditSchedule, onDeleteSchedule, isDeleting }: ScheduleActionsSidebarProps): import("react/jsx-runtime").JSX.Element;
export {};

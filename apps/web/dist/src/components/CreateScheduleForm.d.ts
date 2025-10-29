interface ScheduleItem {
    time: string;
    activity: string;
}
export default function CreateScheduleForm({ onClose, onSave }: {
    onClose: () => void;
    onSave: (schedule: Record<string, ScheduleItem[]>) => void;
}): import("react/jsx-runtime").JSX.Element;
export {};

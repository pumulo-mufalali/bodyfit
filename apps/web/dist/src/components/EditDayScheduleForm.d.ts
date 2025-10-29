interface ScheduleItem {
    time: string;
    activity: string;
}
interface EditDayScheduleFormProps {
    day: string;
    initialItems: ScheduleItem[];
    onClose: () => void;
    onSave: (items: ScheduleItem[]) => void;
}
export default function EditDayScheduleForm({ day, initialItems, onClose, onSave }: EditDayScheduleFormProps): import("react/jsx-runtime").JSX.Element;
export {};

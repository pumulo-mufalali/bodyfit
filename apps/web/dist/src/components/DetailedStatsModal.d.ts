interface DetailedStatsModalProps {
    onClose: () => void;
    labels: string[];
    weightData?: {
        week: string;
        weight: number;
    }[];
    onUpdateWeight?: (weight: number) => void;
    currentWeight?: number;
    isUpdating?: boolean;
    isSuccess?: boolean;
    units?: 'metric' | 'imperial';
}
export default function DetailedStatsModal({ onClose, labels, weightData, onUpdateWeight, currentWeight, isUpdating, isSuccess, units }: DetailedStatsModalProps): import("react/jsx-runtime").JSX.Element;
export {};

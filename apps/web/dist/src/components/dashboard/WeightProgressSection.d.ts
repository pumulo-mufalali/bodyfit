interface WeightProgressSectionProps {
    labels: string[];
    weightData: {
        week: string;
        weight: number;
    }[];
    units: 'metric' | 'imperial';
    onUpdateWeight: () => void;
}
export default function WeightProgressSection({ labels, weightData, units, onUpdateWeight }: WeightProgressSectionProps): import("react/jsx-runtime").JSX.Element;
export {};

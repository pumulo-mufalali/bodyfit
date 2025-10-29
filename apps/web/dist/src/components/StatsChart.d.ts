interface WeightData {
    week: string;
    weight: number;
}
export default function StatsChart({ labels, datasets, weightData, units }: {
    labels: string[];
    datasets?: any[];
    weightData?: WeightData[];
    units?: 'metric' | 'imperial';
}): import("react/jsx-runtime").JSX.Element;
export {};

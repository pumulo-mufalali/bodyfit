import type { WeightEntry } from "../lib/mock-data";
interface WeightChartProps {
    weightHistory: WeightEntry[];
    currentWeight: number;
    onAddWeight: (weight: number) => void;
    isAdding: boolean;
}
export declare function WeightChart({ weightHistory, currentWeight, onAddWeight, isAdding }: WeightChartProps): import("react/jsx-runtime").JSX.Element;
export {};

export declare const convertWeight: (weightKg: number, units: "metric" | "imperial") => number;
export declare const convertHeight: (heightCm: number, units: "metric" | "imperial") => {
    value: number;
    unit: string;
};
export declare const getWeightUnit: (units: "metric" | "imperial") => string;
export declare const getHeightUnit: (units: "metric" | "imperial") => string;
export declare const formatWeight: (weightKg: number, units: "metric" | "imperial") => string;
export declare const formatHeight: (heightCm: number, units: "metric" | "imperial") => string;
export declare const convertWeightData: (weightData: {
    week: string;
    weight: number;
}[], units: "metric" | "imperial") => {
    weight: number;
    week: string;
}[];

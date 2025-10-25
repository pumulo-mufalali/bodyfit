import React from 'react';
export interface StatCardProps {
    title: string;
    main: string;
    sub?: string;
    progress?: {
        value: number;
        total: number;
    } | null;
    gradientClass?: string;
    icon?: React.ReactNode;
    onOpen?: () => void;
}
export declare function StatCard({ title, main, sub, progress, gradientClass, icon, onOpen }: StatCardProps): import("react/jsx-runtime").JSX.Element;
export default StatCard;

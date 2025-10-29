import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User as UserIcon, Weight, Ruler, Target, Save } from "lucide-react";
export function UserProfileCard({ profile, onUpdateProfile, isUpdating, }) {
    const [formData, setFormData] = useState({
        age: profile.age || 0,
        weightKg: profile.weightKg || 0,
        heightCm: profile.heightCm || 0,
        fitnessGoal: profile.fitnessGoal || "",
    });
    // Update formData when profile changes (after successful save)
    useEffect(() => {
        setFormData({
            age: profile.age || 0,
            weightKg: profile.weightKg || 0,
            heightCm: profile.heightCm || 0,
            fitnessGoal: profile.fitnessGoal || "",
        });
    }, [profile]);
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};
        // Temporarily make validation more lenient for testing
        if (formData.age < 1 || formData.age > 150) {
            newErrors.age = "Please enter a valid age between 1 and 150";
        }
        if (formData.weightKg < 1 || formData.weightKg > 500) {
            newErrors.weightKg = "Please enter a valid weight between 1 and 500 kg";
        }
        if (formData.heightCm < 1 || formData.heightCm > 300) {
            newErrors.heightCm = "Please enter a valid height between 1 and 300 cm";
        }
        if (formData.fitnessGoal && formData.fitnessGoal.length > 200) {
            newErrors.fitnessGoal = "Fitness goal must be less than 200 characters";
        }
        console.log('UserProfileCard - Validation errors:', newErrors);
        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        console.log('UserProfileCard - Form is valid:', isValid);
        return isValid;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('UserProfileCard - Form submitted with data:', formData);
        if (validateForm()) {
            console.log('UserProfileCard - Form validation passed, calling onUpdateProfile');
            onUpdateProfile(formData);
        }
        else {
            console.log('UserProfileCard - Form validation failed');
        }
    };
    const handleInputChange = (field) => (e) => {
        const value = field === "fitnessGoal" ? e.target.value : Number(e.target.value);
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };
    const calculateBMI = () => {
        if (formData.weightKg > 0 && formData.heightCm > 0) {
            const heightInMeters = formData.heightCm / 100;
            const bmi = formData.weightKg / (heightInMeters * heightInMeters);
            return bmi.toFixed(1);
        }
        return null;
    };
    const getBMICategory = (bmi) => {
        if (bmi < 18.5)
            return { category: "Underweight", color: "text-blue-600 dark:text-blue-400" };
        if (bmi < 25)
            return { category: "Normal", color: "text-green-600 dark:text-green-400" };
        if (bmi < 30)
            return { category: "Overweight", color: "text-yellow-600 dark:text-yellow-400" };
        return { category: "Obese", color: "text-red-600 dark:text-red-400" };
    };
    const bmi = calculateBMI();
    const bmiCategory = bmi ? getBMICategory(Number(bmi)) : null;
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "space-y-6", children: [_jsxs("div", { className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6", children: [_jsxs("div", { className: "flex items-center space-x-4 mb-6", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg", children: profile.name?.charAt(0) ?? "U" }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: profile.name }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Fitness Profile" })] })] }), bmi && bmiCategory && (_jsx("div", { className: "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "Body Mass Index" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: bmi })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: `text-sm font-medium ${bmiCategory.color}`, children: bmiCategory.category }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "BMI Category" })] })] }) }))] }), _jsxs("div", { className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 dark:text-white mb-6", children: "Update Profile" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(UserIcon, { className: "w-4 h-4 inline mr-2" }), "Age"] }), _jsx("input", { type: "number", min: "13", max: "120", className: `w-full px-4 py-3 rounded-xl border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.age
                                                    ? "border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600"
                                                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"}`, value: formData.age, onChange: handleInputChange("age"), placeholder: "Enter your age" }), errors.age && (_jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.age }))] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(Weight, { className: "w-4 h-4 inline mr-2" }), "Weight (kg)"] }), _jsx("input", { type: "number", min: "30", max: "300", step: "0.1", className: `w-full px-4 py-3 rounded-xl border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.weightKg
                                                    ? "border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600"
                                                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"}`, value: formData.weightKg, onChange: handleInputChange("weightKg"), placeholder: "Enter your weight" }), errors.weightKg && (_jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.weightKg }))] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(Ruler, { className: "w-4 h-4 inline mr-2" }), "Height (cm)"] }), _jsx("input", { type: "number", min: "100", max: "250", className: `w-full px-4 py-3 rounded-xl border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.heightCm
                                            ? "border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600"
                                            : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"}`, value: formData.heightCm, onChange: handleInputChange("heightCm"), placeholder: "Enter your height" }), errors.heightCm && (_jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.heightCm }))] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(Target, { className: "w-4 h-4 inline mr-2" }), "Fitness Goal"] }), _jsx("textarea", { rows: 3, maxLength: 200, className: `w-full px-4 py-3 rounded-xl border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.fitnessGoal
                                            ? "border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600"
                                            : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"}`, value: formData.fitnessGoal, onChange: handleInputChange("fitnessGoal"), placeholder: "Describe your fitness goals..." }), _jsxs("div", { className: "flex justify-between items-center mt-1", children: [errors.fitnessGoal ? (_jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.fitnessGoal })) : (_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "What do you want to achieve?" })), _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [formData.fitnessGoal.length, "/200"] })] })] }), _jsxs(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, type: "submit", disabled: isUpdating, className: "w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(Save, { className: "w-5 h-5 mr-2" }), isUpdating ? "Saving..." : "Save Changes"] })] })] })] }));
}

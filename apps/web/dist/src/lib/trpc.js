// Simple in-memory mock DB
let mockUser = {
    uid: "demo",
    name: "Demo",
    age: 25,
    weightKg: 70,
    theme: "system"
};
// HTTP API client
const API_BASE_URL = "https://api.myfitness.app";
export const api = {
    user: {
        getProfile: async () => {
            // For now, return mock data. Later this will be a real HTTP call
            return mockUser;
            // Future implementation:
            // const response = await fetch(`${API_BASE_URL}/user/profile`, {
            //   method: 'GET',
            //   headers: { 'Content-Type': 'application/json' },
            //   credentials: 'include'
            // });
            // if (!response.ok) throw new Error('Failed to fetch profile');
            // return response.json();
        },
        updateProfile: async (input) => {
            // For now, update mock data. Later this will be a real HTTP call
            mockUser = { ...mockUser, ...input };
            return mockUser;
            // Future implementation:
            // const response = await fetch(`${API_BASE_URL}/user/profile`, {
            //   method: 'PUT',
            //   headers: { 'Content-Type': 'application/json' },
            //   credentials: 'include',
            //   body: JSON.stringify(input)
            // });
            // if (!response.ok) throw new Error('Failed to update profile');
            // return response.json();
        }
    }
};

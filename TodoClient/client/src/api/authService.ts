// src/api/authService.ts
const API_BASE_URL = "https://localhost:7169/api/UserAuth";

const fetchAPI = async (endpoint: string, method: string, body: object) => {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${endpoint} failed: ${errorText}`);
    }

    return response.json();
};

export const registerUser = (name: string, email: string, password: string) => 
    fetchAPI("Register", "POST", { Name: name, Email: email, Password: password });

export const loginUser = (email: string, password: string) => 
    fetchAPI("Login", "POST", { Email: email, Password: password });

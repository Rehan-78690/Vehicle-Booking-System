// lib/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: { 'Content-Type': 'application/json' },
});

export const getPricingRules = async () => {
    const response = await api.get('/pricing');
    return response.data;
};

export const calculatePrice = async (data) => {
    const response = await api.post('/pricing', { action: 'calculate', ...data });
    return response.data.totalPrice;
};

export const updatePricingRule = async (data) => {
    const response = await api.post('/pricing', { action: 'update', ...data });
    return response.data;
};
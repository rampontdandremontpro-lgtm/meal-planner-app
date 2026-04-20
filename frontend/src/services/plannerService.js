import api from "./api";

export async function getWeekMealPlans(date) {
  const response = await api.get("/meal-plans/week", {
    params: { date },
  });

  return Array.isArray(response.data)
    ? response.data
    : response.data?.data || response.data?.mealPlans || [];
}

export async function createMealPlan(payload) {
  const response = await api.post("/meal-plans", payload);
  return response.data;
}
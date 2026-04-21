import api from "./api";

export async function getWeekMealPlans(date) {
  const response = await api.get("/meal-plans/week", {
    params: { date },
  });

  return response.data?.items || [];
}

export async function createMealPlan(payload) {
  const response = await api.post("/meal-plans", payload);
  return response.data;
}

export async function deleteMealPlan(id) {
  const response = await api.delete(`/meal-plans/${id}`);
  return response.data;
}
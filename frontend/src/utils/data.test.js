import { describe, expect, it } from "vitest";

describe("Frontend basic tests", () => {
  it("vérifie que le format de date YYYY-MM-DD est valide", () => {
    const date = "2026-04-21";

    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("vérifie le calcul simple du nombre d'ingrédients cochés", () => {
    const items = [
      { name: "Tomates", checked: true },
      { name: "Riz", checked: false },
      { name: "Poulet", checked: true },
    ];

    const checkedCount = items.filter((item) => item.checked).length;

    expect(checkedCount).toBe(2);
  });

  it("sépare les ingrédients automatiques et manuels", () => {
    const items = [
      { name: "Tomates", source: "automatic" },
      { name: "Eau", source: "manual" },
      { name: "Riz", source: "automatic" },
    ];

    const automaticItems = items.filter((item) => item.source === "automatic");
    const manualItems = items.filter((item) => item.source !== "automatic");

    expect(automaticItems).toHaveLength(2);
    expect(manualItems).toHaveLength(1);
  });
});
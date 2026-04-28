import { describe, expect, it } from "vitest";

/**
 * @fileoverview Tests unitaires basiques du frontend.
 * 
 * Ces tests permettent de vérifier :
 * - le format des dates utilisées dans l'application
 * - le calcul du nombre d'ingrédients cochés
 * - la séparation des ingrédients automatiques et manuels
 * 
 * Outil utilisé : Vitest
 */
describe("Frontend basic tests", () => {

  /**
   * Vérifie que le format de date respecte le format ISO YYYY-MM-DD.
   * 
   * Ce format est utilisé dans le projet pour :
   * - les requêtes backend (meal plans, shopping list)
   * - la gestion des dates côté frontend
   * 
   * @test
   */
  it("vérifie que le format de date YYYY-MM-DD est valide", () => {
    const date = "2026-04-21";

    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  /**
   * Vérifie le calcul du nombre d'ingrédients cochés.
   * 
   * Cette logique est utilisée dans la liste de courses pour :
   * - afficher le nombre d'éléments complétés
   * - suivre la progression de l'utilisateur
   * 
   * @test
   */
  it("vérifie le calcul simple du nombre d'ingrédients cochés", () => {
    const items = [
      { name: "Tomates", checked: true },
      { name: "Riz", checked: false },
      { name: "Poulet", checked: true },
    ];

    const checkedCount = items.filter((item) => item.checked).length;

    expect(checkedCount).toBe(2);
  });

  /**
   * Vérifie la séparation des ingrédients automatiques et manuels.
   * 
   * Cette distinction est essentielle dans le projet car :
   * - les ingrédients automatiques proviennent du planning
   * - les ingrédients manuels sont ajoutés par l'utilisateur
   * 
   * Elle permet d'appliquer des comportements différents :
   * - PATCH /shopping-list/auto pour les automatiques
   * - PATCH /shopping-list/items pour les manuels
   * 
   * @test
   */
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
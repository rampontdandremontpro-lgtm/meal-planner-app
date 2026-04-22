/**
 * @file Planner.stories.jsx
 * @description Stories Storybook de la page planning.
 * Reproduit visuellement la structure hebdomadaire du planning dans un cadre
 * de démonstration hors API.
 */

import StoryPageWrapper from "../stories/StoryPageWrapper";

export default {
  title: "Pages/Planner",
  tags: ["autodocs"],
};

export const Default = {
  render: () => (
    <StoryPageWrapper
      title="Planning des repas"
      subtitle="Organisez vos repas de la semaine"
    >
      <div className="week-nav-card">
        <button className="icon-button">←</button>
        <h2>Semaine du 2026-04-20</h2>
        <button className="icon-button">→</button>
      </div>

      <div className="planner-table">
        <div className="planner-header-row">
          <div className="empty-cell" />
          <div className="planner-day-header">Lundi 20</div>
          <div className="planner-day-header">Mardi 21</div>
          <div className="planner-day-header">Mercredi 22</div>
          <div className="planner-day-header">Jeudi 23</div>
          <div className="planner-day-header">Vendredi 24</div>
          <div className="planner-day-header">Samedi 25</div>
          <div className="planner-day-header">Dimanche 26</div>
        </div>

        {[
          { label: "Petit-déjeuner", className: "planner-breakfast" },
          { label: "Déjeuner", className: "planner-lunch" },
          { label: "Dîner", className: "planner-dinner" },
        ].map((row) => (
          <div className="planner-row" key={row.label}>
            <div className="planner-side-label">{row.label}</div>

            {Array.from({ length: 7 }).map((_, index) => (
              <div className={`planner-cell ${row.className}`} key={index}>
                <button className="planner-add-button">+</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </StoryPageWrapper>
  ),
};
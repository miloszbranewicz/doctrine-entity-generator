import { fieldTypes } from "./fieldTypes";
import type { FieldConfig } from "./entityGenerator";

export function addField(containerId: string = "fieldsContainer"): void {
  const container = document.getElementById(containerId);
  if (!container) return;
  const fieldRow = document.createElement("div");
  fieldRow.className = "field-row";
  fieldRow.innerHTML = `
    <div>
      <label>Nazwa pola:</label>
      <input type="text" class="field-name" placeholder="np. name, price, description">
    </div>
    <div>
      <label>Typ:</label>
      <select class="field-type">
        ${Object.entries(fieldTypes)
          .map(
            ([key, value]) => `<option value="${key}">${value}</option>`
          )
          .join("")}
      </select>
    </div>
    <div>
      <label>Długość:</label>
      <input type="text" class="field-length" placeholder="255">
    </div>
    <div>
      <label>Akcje:</label>
      <button type="button" class="btn btn-danger remove-field">🗑️</button>
    </div>
  `;
  container.appendChild(fieldRow);
}

export function removeField(button: HTMLElement): void {
  button.closest(".field-row")?.remove();
}

export function getFieldsFromDOM(containerId: string = "fieldsContainer"): FieldConfig[] {
  const fieldRows = document.querySelectorAll(`#${containerId} .field-row`);
  const fields: FieldConfig[] = [];
  fieldRows.forEach((row) => {
    const name = (row.querySelector(".field-name") as HTMLInputElement)?.value;
    const type = (row.querySelector(".field-type") as HTMLSelectElement)?.value;
    const length = (row.querySelector(".field-length") as HTMLInputElement)?.value;
    if (name) {
      fields.push({ name, type, length });
    }
  });
  return fields;
}

export function setupFieldActions(containerId: string = "fieldsContainer"): void {
  document.getElementById(containerId)?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("remove-field")) {
      removeField(target);
    }
  });
} 
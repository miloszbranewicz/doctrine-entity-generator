import "./style.css";
import { addField, getFieldsFromDOM, setupFieldActions } from "./domHandlers";
import { generateEntityCode } from "./entityGenerator";

function getInputValue(id: string, fallback = ""): string {
  const el = document.getElementById(id) as HTMLInputElement | null;
  return el?.value || fallback;
}

function generateCode(): void {
  const className = getInputValue("className", "Entity");
  const namespace = getInputValue("namespace", "App\\Entity");
  let repositoryClass = getInputValue("repositoryClass");
  if (!repositoryClass) {
    repositoryClass =
      namespace.replace("Entity", "Repository") +
      "\\" +
      className +
      "Repository";
  }
  const fields = getFieldsFromDOM();
  const code = generateEntityCode({
    className,
    namespace,
    repositoryClass,
    fields,
  });
  const outputElement = document.getElementById("codeOutput");
  if (outputElement) outputElement.textContent = code;
  highlightSyntax(outputElement);
}

function highlightSyntax(element: HTMLElement | null): void {
  // Wyłączone podświetlanie składni
}

function copyToClipboard(): void {
  const codeOutput = document.getElementById("codeOutput");
  const text = codeOutput?.textContent || "";
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const successMessage = document.getElementById("successMessage");
      successMessage?.classList.add("show");
      setTimeout(() => {
        successMessage?.classList.remove("show");
      }, 3000);
    })
    .catch((err) => {
      console.error("Błąd kopiowania: ", err);
      alert("Nie udało się skopiować kodu do schowka");
    });
}

document
  .getElementById("addField")
  ?.addEventListener("click", () => addField());
document
  .getElementById("generateCode")
  ?.addEventListener("click", generateCode);
document.getElementById("copyCode")?.addEventListener("click", copyToClipboard);


document.getElementById("className")?.addEventListener("input", function () {
  const className = (this as HTMLInputElement).value;
  const namespace = getInputValue("namespace", "App\\Entity");
  const repositoryNamespace = namespace.replace("Entity", "Repository");
  const repoInput = document.getElementById(
    "repositoryClass"
  ) as HTMLInputElement | null;
  if (repoInput)
    repoInput.placeholder = `${repositoryNamespace}\\${className}Repository`;
});

setupFieldActions();
addField();

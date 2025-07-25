export const fieldTypes: Record<string, string> = {
  string: "string",
  integer: "integer",
  float: "float",
  boolean: "boolean",
  text: "text",
  datetime: "datetime",
  date: "date",
  time: "time",
  decimal: "decimal",
  json: "json",
};

const typeMap: Record<string, string> = {
  string: "string",
  integer: "int",
  float: "float",
  boolean: "bool",
  text: "string",
  datetime: "\\DateTime",
  date: "\\DateTime",
  time: "\\DateTime",
  decimal: "string",
  json: "array",
};

export function mapToPhpType(doctrineType: string): string {
  return typeMap[doctrineType] || "mixed";
} 
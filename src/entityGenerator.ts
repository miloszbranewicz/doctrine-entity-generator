import { mapToPhpType } from "./fieldTypes";

export interface FieldConfig {
  name: string;
  type: string;
  length?: string;
}

export interface EntityConfig {
  className: string;
  namespace: string;
  repositoryClass: string;
  fields: FieldConfig[];
}

function generateGettersSetters(fields: FieldConfig[]): string {
  let code = "";
  fields.forEach((field) => {
    if (field.name === "id") return;
    const propertyName = field.name;
    const methodName =
      propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
    const phpType = mapToPhpType(field.type);
    code += `
    public function get${methodName}(): ?${phpType}
    {
        return $this->${propertyName};
    }
`;
    code += `
    public function set${methodName}(${phpType} $${propertyName}): self
    {
        $this->${propertyName} = $${propertyName};
        return $this;
    }
`;
  });
  return code;
}

export function generateEntityCode(config: EntityConfig): string {
  const { className, namespace, repositoryClass, fields } = config;
  let code = `<?php
  
namespace ${namespace};

use ${repositoryClass.replace(/\\\\/g, "\\")};
use Doctrine\\ORM\\Mapping as ORM;

/**
 * @ORM\\Entity(repositoryClass=${repositoryClass.split("\\").pop()}::class)
 */
class ${className}
{`;

  fields.forEach((field) => {
    if (field.name === "id") {
      code += `
    /**
     * @ORM\\Id()
     * @ORM\\GeneratedValue()
     * @ORM\\Column(type=\"integer\")
     */
    private $id;
`;
    } else {
      let columnAnnotation = `@ORM\\Column(type=\"${field.type}\"`;
      if (field.length && ["string", "text"].includes(field.type)) {
        columnAnnotation += `, length=${field.length}`;
      }
      columnAnnotation += ")";
      code += `
    /**
     * ${columnAnnotation}
     */
    private $${field.name};
`;
    }
  });

  code += `
    public function getId(): ?int
    {
        return $this->id;
    }
`;
  code += generateGettersSetters(fields);
  code += `
}`;
  return code;
}

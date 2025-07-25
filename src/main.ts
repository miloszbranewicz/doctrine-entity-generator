import './style.css';
let fieldCounter = 1;
        
        const fieldTypes = {
            'string': 'string',
            'integer': 'integer',
            'float': 'float',
            'boolean': 'boolean',
            'text': 'text',
            'datetime': 'datetime',
            'date': 'date',
            'time': 'time',
            'decimal': 'decimal',
            'json': 'json'
        };

        function addField() {
            const container = document.getElementById('fieldsContainer');
            const fieldRow = document.createElement('div');
            fieldRow.className = 'field-row';
            fieldRow.innerHTML = `
                <div>
                    <label>Nazwa pola:</label>
                    <input type="text" class="field-name" placeholder="np. name, price, description">
                </div>
                <div>
                    <label>Typ:</label>
                    <select class="field-type">
                        ${Object.entries(fieldTypes).map(([key, value]) => 
                            `<option value="${key}">${value}</option>`
                        ).join('')}
                    </select>
                </div>
                <div>
                    <label>Długość:</label>
                    <input type="text" class="field-length" placeholder="255">
                </div>
                <div>
                    <label>Akcje:</label>
                    <button type="button" class="btn btn-danger" onclick="removeField(this)">🗑️</button>
                </div>
            `;
            container.appendChild(fieldRow);
        }

        function removeField(button) {
            button.closest('.field-row').remove();
        }

        function generateGettersSetters(fields) {
            let code = '';
            
            fields.forEach(field => {
                if (field.name === 'id') return;
                
                const propertyName = field.name;
                const methodName = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
                const phpType = getPhpType(field.type);
                
                // Getter
                code += `
    public function get${methodName}(): ?${phpType}
    {
        return $this->${propertyName};
    }
`;
                
                // Setter
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

        function getPhpType(doctrineType) {
            const typeMap = {
                'string': 'string',
                'integer': 'int',
                'float': 'float',
                'boolean': 'bool',
                'text': 'string',
                'datetime': '\\DateTime',
                'date': '\\DateTime',
                'time': '\\DateTime',
                'decimal': 'string',
                'json': 'array'
            };
            return typeMap[doctrineType] || 'mixed';
        }

        function generateCode() {
            const className = document.getElementById('className').value || 'Entity';
            const namespace = document.getElementById('namespace').value || 'App\\Entity';
            let repositoryClass = document.getElementById('repositoryClass').value;
            
            if (!repositoryClass) {
                repositoryClass = namespace.replace('Entity', 'Repository') + '\\' + className + 'Repository';
            }

            const fieldRows = document.querySelectorAll('.field-row');
            const fields = [];
            
            fieldRows.forEach(row => {
                const name = row.querySelector('.field-name').value;
                const type = row.querySelector('.field-type').value;
                const length = row.querySelector('.field-length').value;
                
                if (name) {
                    fields.push({ name, type, length });
                }
            });

            let code = `<?php
// src/Entity/${className}.php
namespace ${namespace};

use ${repositoryClass.replace('\\\\', '\\')};
use Doctrine\\ORM\\Mapping as ORM;

/**
 * @ORM\\Entity(repositoryClass=${repositoryClass.split('\\').pop()}::class)
 */
class ${className}
{`;

            // Generowanie właściwości
            fields.forEach(field => {
                if (field.name === 'id') {
                    code += `
    /**
     * @ORM\\Id()
     * @ORM\\GeneratedValue()
     * @ORM\\Column(type="integer")
     */
    private $id;
`;
                } else {
                    let columnAnnotation = `@ORM\\Column(type="${field.type}"`;
                    if (field.length && ['string', 'text'].includes(field.type)) {
                        columnAnnotation += `, length=${field.length}`;
                    }
                    columnAnnotation += ')';
                    
                    code += `
    /**
     * ${columnAnnotation}
     */
    private $${field.name};
`;
                }
            });

            // Getter dla ID
            code += `
    public function getId(): ?int
    {
        return $this->id;
    }
`;

            // Generowanie getterów i setterów
            code += generateGettersSetters(fields);

            code += `
}`;

            const outputElement = document.getElementById('codeOutput');
            outputElement.textContent = code;
            
            // Dodanie prostego podświetlania składni
            highlightSyntax(outputElement);
        }

        function highlightSyntax(element) {
            // Wyłączamy podświetlanie składni - zostawiamy czysty tekst
            // element.innerHTML = element.textContent;
        }

        function copyToClipboard() {
            const codeOutput = document.getElementById('codeOutput');
            const text = codeOutput.textContent;
            
            navigator.clipboard.writeText(text).then(() => {
                const successMessage = document.getElementById('successMessage');
                successMessage.classList.add('show');
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 3000);
            }).catch(err => {
                console.error('Błąd kopiowania: ', err);
                alert('Nie udało się skopiować kodu do schowka');
            });
        }

        // Event listeners
        document.getElementById('addField').addEventListener('click', addField);
        document.getElementById('generateCode').addEventListener('click', generateCode);
        document.getElementById('copyCode').addEventListener('click', copyToClipboard);

        // Auto-generowanie repository class na podstawie class name
        document.getElementById('className').addEventListener('input', function() {
            const className = this.value;
            const namespace = document.getElementById('namespace').value || 'App\\Entity';
            const repositoryNamespace = namespace.replace('Entity', 'Repository');
            document.getElementById('repositoryClass').placeholder = `${repositoryNamespace}\\${className}Repository`;
        });

        // Początkowe dodanie pola przykładowego
        addField();
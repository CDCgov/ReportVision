import React, { useState } from 'react';

interface Label {
  name: string;
  required: boolean;
  color: string;
}

interface LabelCategory {
  title: string;
  items: Label[];
}

interface SidebarProps {
  labels: {
    [key: string]: LabelCategory;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ labels }) => {
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  return (
    <aside className="usa-layout-docs__sidenav">
      <nav aria-label="Side navigation">
        {Object.entries(labels).map(([categoryKey, category]) => (
          <div key={categoryKey} className="usa-accordion">
            <h3 className="usa-accordion__heading">
              <button
                type="button"
                className="usa-accordion__button"
                aria-expanded={expandedCategories[categoryKey] || false}
                aria-controls={`accordion-${categoryKey}`}
                onClick={() => toggleCategory(categoryKey)}
              >
                {category.title}
              </button>
            </h3>
            <div
              id={`accordion-${categoryKey}`}
              className="usa-accordion__content"
              hidden={!expandedCategories[categoryKey]}
            >
              <ul className="usa-list usa-list--unstyled">
                {category.items.map((label) => (
                  <li key={label.name} className="label-item">
                    <span className="label-tag" style={{ backgroundColor: label.color }}>
                      T
                    </span>
                    <span className="label-name">
                      {label.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
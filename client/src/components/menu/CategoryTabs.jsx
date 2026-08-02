import { cn } from '../ui/Button';

export const CategoryTabs = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full overflow-x-auto pb-4 no-scrollbar">
      <div className="flex gap-3 px-4 md:px-0">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "whitespace-nowrap px-5 py-2.5 rounded-badge text-sm font-body-bold transition-colors border",
              selectedCategory === category
                ? "bg-primary text-on-primary border-primary shadow-sm"
                : "bg-surface text-on-surface-variant border-outline hover:bg-surface-variant hover:text-on-surface"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

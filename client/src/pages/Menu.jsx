import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useMenu } from '../hooks/useMenu';
import { CategoryTabs } from '../components/menu/CategoryTabs';
import { MenuSearch } from '../components/menu/MenuSearch';
import { MenuItemCard, MenuItemSkeleton } from '../components/menu/MenuItemCard';
import { ItemDetail } from '../components/menu/ItemDetail';
import { Button } from '../components/ui/Button';

export const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  
  const { items, categories, isLoading, error } = useMenu(selectedCategory, searchQuery);
  
  // Fake cart context for UI representation (will be implemented in Phase 15/16)
  const cartItemCount = 0;

  const handleSearch = (term) => {
    setSearchQuery(term);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const openItemDetail = (item) => {
    setSelectedMenuItem(item);
  };

  const closeItemDetail = () => {
    setSelectedMenuItem(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header section */}
      <div className="bg-surface border-b border-outline sticky top-16 z-30 pt-4 pb-2 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-on-surface">Our Menu</h1>
            <MenuSearch onSearch={handleSearch} />
          </div>
          
          <CategoryTabs 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleCategorySelect} 
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {error && (
          <div className="bg-error/10 text-error p-4 rounded-card border border-error/20 mb-8 flex items-center justify-center">
            <p className="font-body-bold">{error}</p>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <MenuItemSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-variant text-on-surface-variant mb-4">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">No items found</h2>
            <p className="text-on-surface-variant max-w-md mx-auto">
              We couldn't find any menu items matching your criteria. Try adjusting your search or selecting a different category.
            </p>
            {(selectedCategory !== 'All' || searchQuery) && (
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          /* Item Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <div 
                key={item._id} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MenuItemCard item={item} onClick={openItemDetail} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <button className="relative bg-primary text-on-primary p-4 rounded-full shadow-2xl hover:bg-secondary hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/30">
          <ShoppingBag size={28} />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-error text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md border-2 border-primary">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* Item Detail Modal */}
      <ItemDetail 
        isOpen={!!selectedMenuItem} 
        onClose={closeItemDetail} 
        item={selectedMenuItem} 
      />
    </div>
  );
};

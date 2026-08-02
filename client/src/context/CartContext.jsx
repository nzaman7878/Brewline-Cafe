import { createContext, useReducer, useEffect, useMemo } from 'react';

const generateItemKey = (menuItemId, selectedOptions) => {
  const keys = Object.keys(selectedOptions).sort();
  const serialized = keys.map(k => {
    const val = selectedOptions[k];
    if (Array.isArray(val)) {
      return `${k}:${[...val].sort().join(',')}`;
    }
    return `${k}:${val}`;
  }).join('|');
  return `${menuItemId}::${serialized}`;
};

const initialState = {
  items: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItemId, quantity, selectedOptions } = action.payload;
      const key = generateItemKey(menuItemId, selectedOptions);
      const existingItemIndex = state.items.findIndex(item => item.key === key);

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        return { ...state, items: updatedItems };
      } else {
        // Add new item
        return {
          ...state,
          items: [...state.items, { ...action.payload, key }]
        };
      }
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.key !== action.payload.key)
      };
    }
    case 'UPDATE_QUANTITY': {
      const { key, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.key !== key)
        };
      }
      return {
        ...state,
        items: state.items.map(item => item.key === key ? { ...item, quantity } : item)
      };
    }
    case 'CLEAR_CART': {
      return {
        ...state,
        items: []
      };
    }
    case 'SET_CART': {
      return {
        ...state,
        items: action.payload.items || []
      };
    }
    default:
      return state;
  }
};

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    try {
      const localData = localStorage.getItem('brewline_cart');
      return localData ? JSON.parse(localData) : initial;
    } catch (e) {
      console.error('Failed to parse cart from local storage', e);
      return initial;
    }
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('brewline_cart', JSON.stringify(state));
  }, [state]);

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (key) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { key } });
  };

  const updateQuantity = (key, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { key, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Computed properties
  const cartItemCount = useMemo(() => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  const cartSubtotal = useMemo(() => {
    return state.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  }, [state.items]);

  return (
    <CartContext.Provider 
      value={{ 
        items: state.items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart,
        cartItemCount,
        cartSubtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

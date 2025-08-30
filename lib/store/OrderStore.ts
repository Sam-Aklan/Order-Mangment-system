import { create } from 'zustand';

type ItemSelection = {
  id: string;
  quantity: number;
  price: number;
  itemName:string;
  category:string;
  stock:number;
  isNew?:boolean
};
 
type OrderStore = {
  customerId:string|null;
  selectedItems: Record<string, ItemSelection>;
  setProductQuantity: (
    id: string,
    quantity: number,
    price: number,
    itemName: string,
    stock:number,
    category:string,
    isNew?: boolean
  ) => void;
  removeProduct: (id: string) => void;
  clearOrder: () => void;
  totalPrice: () => number;
  setCustomer:(id:string)=>void;
  getOrderPayload: () => {
    customerId: string | null;
    products: ItemSelection[];
    total: number;
  };

  // For editing
  initializeOrder: (
    customerId: string,
    items: ItemSelection[]
  ) => void;
};

export const useOrderStore = create<OrderStore>((set, get) => ({

  selectedItems: {},
  customerId:null,

  setProductQuantity: (id, quantity, price, itemName, stock,category,isNew = false) => {
    set((state) => {
      // Case 1: Remove if new and quantity <= 0
      if (isNew && quantity <= 0) {
        const updated = { ...state.selectedItems };
        delete updated[id];
        return { selectedItems: updated };
      }

      // Case 2: Existing → keep with quantity = 0
      if (!isNew && quantity <= 0) {
        return {
          selectedItems: {
            ...state.selectedItems,
            [id]: { id, quantity: 0, price, itemName, isNew,stock,category },
          },
        };
      }

      // Case 3: Normal update
      return {
        selectedItems: {
          ...state.selectedItems,
          [id]: { id, quantity, price, itemName, isNew,stock,category },
        },
      };
    });
  },

  removeProduct: (id) => {
    set((state) => {
      const item = state.selectedItems[id];
      const updated = { ...state.selectedItems };

      if (item?.isNew) {
        // remove completely
        delete updated[id];
      } else if (item) {
        // keep but mark as deleted
        updated[id] = { ...item, quantity: 0 };
      }
      return { selectedItems: updated };
    });
  },

  clearOrder: () => set({ selectedItems: {} }),

  totalPrice: () =>
    Object.values(get().selectedItems).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
setCustomer(id) {
    set(()=>{
       return {customerId:id}
    })
},
getOrderPayload:()=>({
    customerId: get().customerId||null,
    products: Object.values(get().selectedItems),
    total: get().totalPrice()
}),
initializeOrder:(customerId,items)=>set(
  {
    customerId,
    selectedItems:items.reduce((acc,item)=>{
      acc[item.id]=item
      return acc
    },{} as Record<string, ItemSelection>)
  }
)
}));

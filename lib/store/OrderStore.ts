import { create } from 'zustand';

type ItemSelection = {
  id: string;
  quantity: number;
  price: number;
  itemName:string;
};
 type CustomerSelection ={
    id:string,
    name:string,
 }
type OrderStore = {
  customer:CustomerSelection|null;
  selectedItems: Record<string, ItemSelection>;
  setProductQuantity: (id: string, quantity: number, price: number,itemName:string) => void;
  removeProduct: (id: string) => void;
  clearOrder: () => void;
  totalPrice: () => number;
  setCustomer:(id:string,name:string)=>void;
  getOrderPayload: () => {
    customerId: string | null;
    products: ItemSelection[];
    total: number;
  };
};

export const useOrderStore = create<OrderStore>((set, get) => ({

  selectedItems: {},
  customer:null,

  setProductQuantity: (id, quantity, price,itemName) => {
    set((state) => {
      if (quantity <= 0) {
        const updated = { ...state.selectedItems };
        delete updated[id];
        return { selectedItems: updated };
      }

      return {
        selectedItems: {
          ...state.selectedItems,
          [id]: { id, quantity, price,itemName },
        },
      };
    });
  },

  removeProduct: (id) => {
    set((state) => {
      const updated = { ...state.selectedItems };
      delete updated[id];
      return { selectedItems: updated };
    });
  },

  clearOrder: () => set({ selectedItems: {} }),

  totalPrice: () =>
    Object.values(get().selectedItems).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
setCustomer(id, name) {
    set(()=>{
       return {customer:{id,name}}
    })
},
getOrderPayload:()=>({
    customerId: get().customer?.id||null,
    products: Object.values(get().selectedItems),
    total: get().totalPrice()
})
}));

import { useMemo, useState } from "react";

import { CartContext } from "@/contexts/cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function add(book) {
    setItems((current) => {
      const existing = current.find((item) => item.MaSach === book.MaSach);

      if (existing) {
        return current.map((item) => {
          if (item.MaSach !== book.MaSach) return item;

          return {
            ...item,
            SoLuong: Math.min(item.SoLuong + 1, Number(book.SoLuong)),
          };
        });
      }

      return [
        ...current,
        {
          MaSach: book.MaSach,
          TenSach: book.TenSach,
          TonKho: Number(book.SoLuong),
          SoLuong: 1,
        },
      ];
    });
  }

  function update(bookId, quantity) {
    setItems((current) => current.map((item) => {
      if (item.MaSach !== bookId) return item;

      return {
        ...item,
        SoLuong: Math.max(1, Math.min(Number(quantity), item.TonKho)),
      };
    }));
  }

  function remove(bookId) {
    setItems((current) => current.filter((item) => item.MaSach !== bookId));
  }

  function clear() {
    setItems([]);
  }

  const value = useMemo(() => ({ items, add, update, remove, clear }), [items]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

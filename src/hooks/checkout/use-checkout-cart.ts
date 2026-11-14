import { useState, useMemo } from "react";
import type { Appointment } from "../../interface/appointment.types";
import type { Product } from "../../interface/product.types";
import type { CartServiceItem, CartProductItem } from "../../interface/checkout.types";
import type { CheckoutPaymentPayload } from "../../services/checkout.service";

export interface UseCheckoutCartProps {
  selectedAppointment: Appointment | null;
  includeApptServices: boolean;
  appointmentServices: CartServiceItem[];
  setErrorMsg: (msg: string | null) => void;
}

export function useCheckoutCart({
  selectedAppointment,
  includeApptServices,
  appointmentServices,
  setErrorMsg,
}: UseCheckoutCartProps) {
  const [additionalServices, setAdditionalServices] = useState<CartServiceItem[]>([]);
  const [cartProducts, setCartProducts] = useState<CartProductItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [payments, setPayments] = useState<CheckoutPaymentPayload[]>([
    { method: "cash", amount: 0, reference: "" },
  ]);

  const handleAddServiceToCart = (svc: { id: string; name: string; price: number; duration: number }) => {
    setAdditionalServices((prev) => {
      const existing = prev.find((s) => s.id === svc.id);
      if (existing) {
        return prev.map((s) => (s.id === svc.id ? { ...s, quantity: s.quantity + 1 } : s));
      }
      return [
        ...prev,
        {
          id: svc.id,
          name: svc.name,
          price: svc.price,
          duration: svc.duration,
          quantity: 1,
        },
      ];
    });
  };

  const handleAddProductToCart = (prod: Product) => {
    if (prod.stock <= 0) {
      setErrorMsg(`Product "${prod.name}" is out of stock.`);
      return;
    }

    setCartProducts((prev) => {
      const existing = prev.find((p) => p.id === prod.id);
      if (existing) {
        if (existing.quantity >= prod.stock) {
          setErrorMsg(`Only ${prod.stock} units available for ${prod.name}.`);
          return prev;
        }
        return prev.map((p) => (p.id === prod.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [
        ...prev,
        {
          id: prod.id,
          name: prod.name,
          sku: prod.sku,
          price: prod.sellingPrice,
          stock: prod.stock,
          quantity: 1,
        },
      ];
    });
  };

  const subtotal = useMemo(() => {
    let sum = 0;
    if (includeApptServices && selectedAppointment) {
      appointmentServices.forEach((s) => {
        sum += s.price * s.quantity;
      });
    }
    additionalServices.forEach((s) => {
      sum += s.price * s.quantity;
    });
    cartProducts.forEach((p) => {
      sum += p.price * p.quantity;
    });
    return sum;
  }, [includeApptServices, selectedAppointment, appointmentServices, additionalServices, cartProducts]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - Number(discountAmount || 0));
  }, [subtotal, discountAmount]);

  const totalPaid = useMemo(() => {
    return payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }, [payments]);

  const balanceDue = useMemo(() => {
    return Math.max(0, grandTotal - totalPaid);
  }, [grandTotal, totalPaid]);

  const changeDue = useMemo(() => {
    return totalPaid > grandTotal ? totalPaid - grandTotal : 0;
  }, [grandTotal, totalPaid]);

  const handlePayFull = (method: "cash" | "card" | "bank" = "cash") => {
    setPayments([{ method, amount: grandTotal, reference: "" }]);
  };

  const resetCart = () => {
    setAdditionalServices([]);
    setCartProducts([]);
    setDiscountAmount(0);
    setPayments([{ method: "cash", amount: 0, reference: "" }]);
  };

  return {
    additionalServices,
    setAdditionalServices,
    cartProducts,
    setCartProducts,
    discountAmount,
    setDiscountAmount,
    payments,
    setPayments,
    handleAddServiceToCart,
    handleAddProductToCart,
    subtotal,
    grandTotal,
    totalPaid,
    balanceDue,
    changeDue,
    handlePayFull,
    resetCart,
  };
}

export default useCheckoutCart;

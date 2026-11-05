import { useState, type FormEvent } from "react";
import { PlusCircle, ShoppingBag, AlertTriangle, ArrowRight } from "lucide-react";
import Modal from "../../../../components/modal";
import type {
  Product,
  StockInPayload,
  StockAdjustmentPayload,
  StockSalePayload,
} from "../../../../interface/product.types";
import { formatPrice } from "../../../../helpers/price.helper";

export type StockModalMode = "stock_in" | "adjustment" | "sale";

export type StockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  initialMode?: StockModalMode;
  onStockIn: (productId: string, payload: StockInPayload) => void;
  onStockAdjustment: (productId: string, payload: StockAdjustmentPayload) => void;
  onRecordSale: (productId: string, payload: StockSalePayload) => void;
};

type StockModalFormProps = {
  product: Product;
  initialMode: StockModalMode;
  onClose: () => void;
  onStockIn: (productId: string, payload: StockInPayload) => void;
  onStockAdjustment: (productId: string, payload: StockAdjustmentPayload) => void;
  onRecordSale: (productId: string, payload: StockSalePayload) => void;
};

function StockModalForm({
  product,
  initialMode,
  onClose,
  onStockIn,
  onStockAdjustment,
  onRecordSale,
}: StockModalFormProps) {
  const [mode, setMode] = useState<StockModalMode>(initialMode);

  // Stock In fields
  const [stockInQty, setStockInQty] = useState(10);
  const [stockInCost, setStockInCost] = useState<number>(product.costPrice);
  const [stockInSupplier, setStockInSupplier] = useState(product.supplier || "");
  const [stockInNote, setStockInNote] = useState("");

  // Adjustment fields
  const [adjustType, setAdjustType] = useState<"damaged" | "lost" | "correction">("damaged");
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustReason, setAdjustReason] = useState("");

  // Sale fields
  const [saleQty, setSaleQty] = useState(1);
  const [saleCustomer, setSaleCustomer] = useState("");
  const [saleNote, setSaleNote] = useState("");

  const currentStock = product.stock;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === "stock_in") {
      if (stockInQty <= 0) return;
      onStockIn(product.id, {
        quantity: stockInQty,
        costPrice: stockInCost || product.costPrice,
        supplier: stockInSupplier.trim() || undefined,
        note: stockInNote.trim() || undefined,
      });
    } else if (mode === "adjustment") {
      if (adjustQty <= 0) return;
      onStockAdjustment(product.id, {
        type: adjustType,
        quantity: adjustQty,
        reason: adjustReason.trim() || `${adjustType} inventory adjustment`,
      });
    } else if (mode === "sale") {
      if (saleQty <= 0 || saleQty > currentStock) return;
      onRecordSale(product.id, {
        quantity: saleQty,
        customer: saleCustomer.trim() || undefined,
        note: saleNote.trim() || undefined,
      });
    }
    onClose();
  };

  const getNewStock = () => {
    if (mode === "stock_in") {
      return currentStock + (stockInQty || 0);
    }
    if (mode === "adjustment") {
      return Math.max(0, currentStock - (adjustQty || 0));
    }
    if (mode === "sale") {
      return Math.max(0, currentStock - (saleQty || 0));
    }
    return currentStock;
  };

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMode("stock_in")}
          className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition cursor-pointer ${
            mode === "stock_in"
              ? "bg-white text-emerald-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <PlusCircle className="size-3.5" />
          <span>Stock In</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("adjustment")}
          className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition cursor-pointer ${
            mode === "adjustment"
              ? "bg-white text-amber-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <AlertTriangle className="size-3.5" />
          <span>Adjustment</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("sale")}
          className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition cursor-pointer ${
            mode === "sale"
              ? "bg-white text-primary shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ShoppingBag className="size-3.5" />
          <span>Record Sale</span>
        </button>
      </div>

      {/* Stock Level Preview Banner */}
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div>
          <span className="text-[11px] text-slate-500">Current Stock</span>
          <p className="text-base font-bold text-slate-900">{currentStock} units</p>
        </div>
        <ArrowRight className="size-4 text-slate-400" />
        <div className="text-right">
          <span className="text-[11px] text-slate-500">Updated Stock</span>
          <p className="text-base font-bold text-emerald-600">{getNewStock()} units</p>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {mode === "stock_in" && (
          <>
            <div>
              <label className="block mb-1 font-medium text-slate-700">
                Quantity to Add <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={stockInQty}
                onChange={(e) => setStockInQty(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g. 10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-medium text-slate-700">
                  Purchase Unit Cost (Rs.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={stockInCost || ""}
                  onChange={(e) => setStockInCost(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder={product.costPrice.toString()}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-slate-700">
                  Supplier / Vendor
                </label>
                <input
                  type="text"
                  value={stockInSupplier}
                  onChange={(e) => setStockInSupplier(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Cosmo Brands"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-slate-700">
                Note / PO Reference
              </label>
              <input
                type="text"
                value={stockInNote}
                onChange={(e) => setStockInNote(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g. Invoice #INV-8921"
              />
            </div>
          </>
        )}

        {mode === "adjustment" && (
          <>
            <div>
              <label className="block mb-1 font-medium text-slate-700">
                Adjustment Reason Type <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType("damaged")}
                  className={`rounded-lg border p-2 text-center font-medium transition cursor-pointer ${
                    adjustType === "damaged"
                      ? "border-rose-500 bg-rose-50 text-rose-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Damaged
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType("lost")}
                  className={`rounded-lg border p-2 text-center font-medium transition cursor-pointer ${
                    adjustType === "lost"
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Lost / Expired
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType("correction")}
                  className={`rounded-lg border p-2 text-center font-medium transition cursor-pointer ${
                    adjustType === "correction"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Count Correction
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-slate-700">
                Quantity to Deduct <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max={currentStock}
                required
                value={adjustQty}
                onChange={(e) => setAdjustQty(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g. 1"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-slate-700">
                Reason Description <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g. Bottle broken during shelf arrangement"
              />
            </div>
          </>
        )}

        {mode === "sale" && (
          <>
            <div>
              <label className="block mb-1 font-medium text-slate-700">
                Quantity Sold <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max={currentStock}
                required
                value={saleQty}
                onChange={(e) => setSaleQty(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="1"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Available in stock: {currentStock}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-primary-lighter/40 p-2.5 border border-primary/20">
              <span className="text-[11px] text-slate-600">Total Sale Amount:</span>
              <span className="font-bold text-primary">
                {formatPrice(product.sellingPrice * saleQty)}
              </span>
            </div>

            <div>
              <label className="block mb-1 font-medium text-slate-700">
                Customer / Stylist Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={saleCustomer}
                onChange={(e) => setSaleCustomer(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g. Kasun or Walk-in Customer"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-slate-700">
                Sale Notes <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={saleNote}
                onChange={(e) => setSaleNote(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g. Sold after haircut service"
              />
            </div>
          </>
        )}

        <div className="mt-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
          >
            {mode === "stock_in"
              ? "Confirm Stock In"
              : mode === "adjustment"
              ? "Confirm Adjustment"
              : "Confirm Sale"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function StockModal({
  isOpen,
  onClose,
  product,
  initialMode = "stock_in",
  onStockIn,
  onStockAdjustment,
  onRecordSale,
}: StockModalProps) {
  if (!product || !isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Stock Management"
      description={`Manage inventory balance for "${product.name}" (${product.sku})`}
      size="md"
    >
      <StockModalForm
        key={`${product.id}-${initialMode}`}
        product={product}
        initialMode={initialMode}
        onClose={onClose}
        onStockIn={onStockIn}
        onStockAdjustment={onStockAdjustment}
        onRecordSale={onRecordSale}
      />
    </Modal>
  );
}

export default StockModal;

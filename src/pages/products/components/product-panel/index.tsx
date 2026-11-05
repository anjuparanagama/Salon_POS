import { useState, type FormEvent } from "react";
import { Sparkles, DollarSign, Layers, AlertTriangle } from "lucide-react";
import SidePanel from "../../../../components/side-panel";
import type { Product, ProductFormData } from "../../../../interface/product.types";
import { formatPrice } from "../../../../helpers/price.helper";

export type ProductPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  editingProduct?: Product | null;
};

const categoryOptions = [
  { value: "shampoo", label: "Shampoo" },
  { value: "hair_care", label: "Hair Care" },
  { value: "skin_care", label: "Skin Care" },
  { value: "styling", label: "Styling Products" },
  { value: "color", label: "Color & Bleach" },
  { value: "treatment", label: "Treatment" },
  { value: "equipment", label: "Equipment & Tools" },
  { value: "other", label: "Other Supplies" },
];

const sampleImagePresets = [
  { label: "Shampoo", url: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&auto=format&fit=crop&q=60" },
  { label: "Serum", url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=60" },
  { label: "Treatment", url: "https://images.unsplash.com/photo-1608248597359-216e453fa844?w=300&auto=format&fit=crop&q=60" },
  { label: "Tool", url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=60" },
];

type ProductFormProps = {
  initialValues: ProductFormData;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
};

function ProductForm({
  initialValues,
  isEditing,
  onClose,
  onSubmit,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialValues);

  const generateSku = () => {
    const prefix = formData.category.slice(0, 3).toUpperCase() || "PRD";
    const random = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, sku: `${prefix}-${random}` }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim()) return;
    onSubmit(formData);
    onClose();
  };

  const profit = Math.max(0, formData.sellingPrice - formData.costPrice);
  const marginPercent =
    formData.sellingPrice > 0
      ? Math.round((profit / formData.sellingPrice) * 100)
      : 0;

  return (
    <form id="product-form" onSubmit={handleSubmit} className="flex flex-col gap-5 text-xs">
      {/* Section 1: Product Information */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Layers className="size-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Product Information
          </h3>
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">
            Product Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Moroccan Argan Repair Shampoo (500ml)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-slate-700">
                SKU / Product Code <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={generateSku}
                className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline cursor-pointer"
              >
                <Sparkles className="size-3" />
                Generate
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="e.g. SHP-ARG-01"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full font-mono rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">
            Brand / Manufacturer <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Moroccanoil, Olaplex, L'Oreal"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">
            Description <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Key benefits, usage instructions, or volume..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Product Image */}
        <div>
          <label className="block mb-1 font-medium text-slate-700">
            Product Image URL <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder="https://example.com/product.jpg"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {formData.imageUrl && (
              <div className="size-8 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="size-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Quick Presets */}
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-400 font-medium">Quick presets:</span>
            {sampleImagePresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                className="rounded bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600 transition cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Pricing */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <DollarSign className="size-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Pricing
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 font-medium text-slate-700">
              Cost Price (Purchase Price) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">
                Rs.
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
                value={formData.costPrice || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    costPrice: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700">
              Selling Price (Retail Price) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">
                Rs.
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
                value={formData.sellingPrice || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sellingPrice: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Profit Preview Pill */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100">
          <span className="text-[11px] text-slate-500">Estimated Unit Profit:</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-600">
              +{formatPrice(profit)}
            </span>
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
              {marginPercent}% margin
            </span>
          </div>
        </div>
      </div>

      {/* Section 3: Stock Information */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <AlertTriangle className="size-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Stock Information
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 font-medium text-slate-700">
              {isEditing ? "Current Stock Quantity" : "Initial Stock Quantity"}{" "}
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: parseInt(e.target.value, 10) || 0,
                })
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Available items in salon storage
            </span>
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700">
              Low Stock Alert Level <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.lowStockLevel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lowStockLevel: parseInt(e.target.value, 10) || 1,
                })
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Triggers warning when stock drops to or below this
            </span>
          </div>
        </div>
      </div>

      {/* Section 4: Status */}
      <div className="flex flex-col gap-2.5">
        <label className="block font-medium text-slate-700">Product Status</label>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, status: "active" })}
            className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 font-medium transition cursor-pointer ${
              formData.status === "active"
                ? "border-emerald-500 bg-emerald-50/50 text-emerald-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>Active</span>
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, status: "inactive" })}
            className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 font-medium transition cursor-pointer ${
              formData.status === "inactive"
                ? "border-slate-400 bg-slate-100 text-slate-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="size-2 rounded-full bg-slate-400" />
            <span>Inactive</span>
          </button>
        </div>
      </div>
    </form>
  );
}

export function ProductPanel({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
}: ProductPanelProps) {
  const isEditing = Boolean(editingProduct);

  const initialValues: ProductFormData = editingProduct
    ? {
        name: editingProduct.name,
        sku: editingProduct.sku,
        category: editingProduct.category,
        brand: editingProduct.brand || "",
        description: editingProduct.description || "",
        imageUrl: editingProduct.imageUrl || "",
        costPrice: editingProduct.costPrice,
        sellingPrice: editingProduct.sellingPrice,
        stock: editingProduct.stock,
        lowStockLevel: editingProduct.lowStockLevel,
        status: editingProduct.status,
      }
    : {
        name: "",
        sku: "",
        category: "shampoo",
        brand: "",
        description: "",
        imageUrl: "",
        costPrice: 0,
        sellingPrice: 0,
        stock: 10,
        lowStockLevel: 5,
        status: "active",
      };

  const footer = (
    <div className="flex items-center justify-end gap-2.5">
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="product-form"
        className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-dark cursor-pointer"
      >
        {isEditing ? "Save Changes" : "Add Product"}
      </button>
    </div>
  );

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Product" : "Add New Product"}
      description={
        isEditing
          ? "Update product details, pricing, and stock alert levels."
          : "Register a new salon product into your retail inventory."
      }
      size="lg"
      footer={footer}
    >
      <ProductForm
        key={editingProduct ? editingProduct.id : `new-${isOpen}`}
        initialValues={initialValues}
        isEditing={isEditing}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </SidePanel>
  );
}

export default ProductPanel;

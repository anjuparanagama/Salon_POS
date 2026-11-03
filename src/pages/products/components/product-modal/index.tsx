import { useState, type FormEvent } from "react";
import Modal from "../../../../components/modal";
import type { Product, ProductFormData } from "../../../../interface/product.types";

export type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  editingProduct?: Product | null;
};

const defaultInitialData: ProductFormData = {
  name: "",
  sku: "",
  category: "hair_care",
  brand: "",
  stock: 10,
  minStock: 5,
  costPrice: 15,
  sellingPrice: 30,
  supplier: "Salon Direct Supplies",
};

type ProductFormProps = {
  initialValues: ProductFormData;
  isEditing: boolean;
  onCancel: () => void;
  onSubmit: (data: ProductFormData) => void;
};

function ProductForm({ initialValues, isEditing, onCancel, onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialValues);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Product Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Kerastase Nutritive Shampoo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">SKU / Barcode *</label>
          <input
            type="text"
            required
            placeholder="e.g. KNT-0012"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value as ProductFormData["category"] })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          >
            <option value="hair_care">Hair Care</option>
            <option value="skin_care">Skin Care</option>
            <option value="styling">Styling Products</option>
            <option value="color">Color & Bleach</option>
            <option value="equipment">Equipment & Tools</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Brand</label>
          <input
            type="text"
            placeholder="e.g. L'Oreal Professional, Olaplex"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Initial Stock</label>
          <input
            type="number"
            min="0"
            required
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Min Alert</label>
          <input
            type="number"
            min="1"
            required
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Cost ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={formData.costPrice}
            onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Retail ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={formData.sellingPrice}
            onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium text-slate-700">Supplier / Distributor</label>
        <input
          type="text"
          placeholder="e.g. Apex Salon Logistics LLC"
          value={formData.supplier}
          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="mt-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
        >
          {isEditing ? "Save Product" : "Add to Inventory"}
        </button>
      </div>
    </form>
  );
}

export function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
}: ProductModalProps) {
  const initialValues: ProductFormData = editingProduct
    ? {
        name: editingProduct.name,
        sku: editingProduct.sku,
        category: editingProduct.category,
        brand: editingProduct.brand,
        stock: editingProduct.stock,
        minStock: editingProduct.minStock,
        costPrice: editingProduct.costPrice,
        sellingPrice: editingProduct.sellingPrice,
        supplier: editingProduct.supplier,
      }
    : defaultInitialData;

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProduct ? "Edit Product" : "Add New Inventory Product"}
      description="Track salon retail products, professional supplies, and stock levels."
      size="md"
    >
      <ProductForm
        key={editingProduct ? editingProduct.id : "new-product"}
        initialValues={initialValues}
        isEditing={Boolean(editingProduct)}
        onCancel={onClose}
        onSubmit={handleFormSubmit}
      />
    </Modal>
  );
}

export default ProductModal;


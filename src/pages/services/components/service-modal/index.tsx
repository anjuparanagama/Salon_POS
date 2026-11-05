import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { Plus, X, ImagePlus, Check } from "lucide-react";
import SidePanel from "../../../../components/side-panel";
import type {
  ServiceFormData,
  ServiceItem,
  ServiceCategoryItem,
} from "../../../../interface/service.types";

export type ServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => void;
  editingService?: ServiceItem | null;
  categories: ServiceCategoryItem[];
  onAddCategory: (category: ServiceCategoryItem) => void;
};

const MAX_IMAGES = 5;

const defaultInitialData: ServiceFormData = {
  name: "",
  category: "hair",
  durationMinutes: 45,
  price: 45,
  description: "",
  isActive: true,
  images: [],
};

type ServiceFormProps = {
  initialValues: ServiceFormData;
  categories: ServiceCategoryItem[];
  onAddCategory: (category: ServiceCategoryItem) => void;
  onSubmit: (data: ServiceFormData) => void;
};

function ServiceForm({
  initialValues,
  categories,
  onAddCategory,
  onSubmit,
}: ServiceFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>(initialValues);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const images = formData.images || [];

  const handleAddNewCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    const value = trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newCategory: ServiceCategoryItem = {
      id: `cat-${Date.now()}`,
      label: trimmed,
      value: value || `category-${Date.now()}`,
    };

    onAddCategory(newCategory);
    setFormData((prev) => ({ ...prev, category: newCategory.value }));
    setNewCategoryName("");
    setIsAddingCategory(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) return;

    const filesToRead = Array.from(files).slice(0, remainingSlots);

    filesToRead.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setFormData((prev) => {
            const currentImages = prev.images || [];
            if (currentImages.length >= MAX_IMAGES) return prev;
            return {
              ...prev,
              images: [...currentImages, result],
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <form id="service-form" onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
      {/* Service Name */}
      <div>
        <label className="block mb-1 font-medium text-slate-700">Service Name *</label>
        <input
          type="text"
          required
          placeholder="e.g. Keratin Hair Therapy"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
        />
      </div>

      {/* Category Section with Inline Add */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="font-medium text-slate-700">Category *</label>
          {!isAddingCategory ? (
            <button
              type="button"
              onClick={() => setIsAddingCategory(true)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-dark cursor-pointer transition"
            >
              <Plus className="size-3" />
              <span>New Category</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsAddingCategory(false);
                setNewCategoryName("");
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        {isAddingCategory ? (
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-primary/30 animate-in fade-in duration-150">
            <input
              type="text"
              autoFocus
              placeholder="Enter category name (e.g. Hair Coloring)"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddNewCategory();
                } else if (e.key === "Escape") {
                  setIsAddingCategory(false);
                  setNewCategoryName("");
                }
              }}
              className="flex-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-900 outline-none bg-white focus:border-primary"
            />
            <button
              type="button"
              onClick={handleAddNewCategory}
              disabled={!newCategoryName.trim()}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-50 transition cursor-pointer"
            >
              <Check className="size-3.5" />
              <span>Add</span>
            </button>
          </div>
        ) : (
          <select
            value={formData.category}
            onChange={(e) => {
              if (e.target.value === "__add_new__") {
                setIsAddingCategory(true);
              } else {
                setFormData({ ...formData, category: e.target.value });
              }
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.value}>
                {cat.label}
              </option>
            ))}
            <option value="__add_new__">+ Add New Category...</option>
          </select>
        )}
      </div>

      {/* Duration and Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-medium text-slate-700">Duration (mins) *</label>
          <input
            type="number"
            min="5"
            step="5"
            required
            value={formData.durationMinutes}
            onChange={(e) =>
              setFormData({ ...formData, durationMinutes: Number(e.target.value) })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-700">Price (Rs.) *</label>
          <input
            type="number"
            min="0"
            step="0.5"
            required
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          />
        </div>
      </div>

      {/* Image Gallery Upload (Max 5) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="font-medium text-slate-700">Service Photos</label>
          <span className="text-[11px] font-medium text-slate-400">
            {images.length} / {MAX_IMAGES} uploaded
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
          {images.map((imgSrc, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-lg border border-slate-200 bg-slate-50 overflow-hidden shadow-xs"
            >
              <img
                src={imgSrc}
                alt={`Service preview ${idx + 1}`}
                className="size-full object-cover"
              />
              {idx === 0 && (
                <span className="absolute top-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold text-white tracking-wide">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition cursor-pointer"
                title="Remove photo"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}

          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-primary/50 text-slate-400 hover:text-primary transition cursor-pointer p-2 text-center"
            >
              <ImagePlus className="size-5 mb-1" />
              <span className="text-[11px] font-medium leading-tight">Add Photo</span>
              <span className="text-[9px] text-slate-400">Up to 5</span>
            </button>
          )}
        </div>
        <p className="mt-1 text-[11px] text-slate-400">
          First photo will be used as the service cover image in catalog cards.
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium text-slate-700">Service Description</label>
        <textarea
          rows={3}
          placeholder="Describe the treatment, products included, and client benefits..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
        />
      </div>

      {/* Active Toggle */}
      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
        <label htmlFor="service-active-toggle" className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            id="service-active-toggle"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="mt-0.5 rounded border-slate-300 text-primary focus:ring-primary size-4"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800">Publish as active</span>
            <span className="text-[11px] text-slate-500">
              When enabled, this service will be visible to clients and selectable in appointments.
            </span>
          </div>
        </label>
      </div>
    </form>
  );
}

export function ServiceModal({
  isOpen,
  onClose,
  onSubmit,
  editingService,
  categories,
  onAddCategory,
}: ServiceModalProps) {
  const isEdit = Boolean(editingService);

  const initialValues: ServiceFormData = editingService
    ? {
        name: editingService.name,
        category: editingService.category,
        durationMinutes: editingService.durationMinutes,
        price: editingService.price,
        description: editingService.description,
        isActive: editingService.isActive,
        images: editingService.images || [],
      }
    : defaultInitialData;

  const handleFormSubmit = (data: ServiceFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Service" : "Add New Service"}
      description={
        isEdit
          ? `Update details and pricing for "${editingService?.name}"`
          : "Configure salon service details, photos, pricing, and category."
      }
      size="lg"
      side="right"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="service-form"
            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
          >
            {isEdit ? "Save Changes" : "Create Service"}
          </button>
        </div>
      }
    >
      <ServiceForm
        key={editingService ? editingService.id : "new-service"}
        initialValues={initialValues}
        categories={categories}
        onAddCategory={onAddCategory}
        onSubmit={handleFormSubmit}
      />
    </SidePanel>
  );
}

export default ServiceModal;

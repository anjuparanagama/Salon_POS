import {
  useState,
  useEffect,
  useRef,
  type FormEvent,
  type ChangeEvent,
  type DragEvent,
} from "react";
import {
  Sparkles,
  DollarSign,
  Layers,
  AlertTriangle,
  Upload,
  Trash2,
  Link2,
  Loader2,
  Power,
} from "lucide-react";
import SidePanel from "../../../../components/side-panel";
import { Button } from "../../../../components/button";
import { Input } from "../../../../components/input";
import type {
  Product,
  ProductFormData,
} from "../../../../interface/product.types";
import { formatPrice } from "../../../../helpers/price.helper";
import { productsService } from "../../../../services/products.service";

function compressImage(
  file: File,
  maxWidth = 600,
  maxHeight = 600,
  quality = 0.8,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export type ProductPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  editingProduct?: Product | null;
};

const categoryOptions: Array<{ value: string; label: string }> = [];

const sampleImagePresets = [
  {
    label: "Shampoo",
    url: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&auto=format&fit=crop&q=60",
  },
  {
    label: "Serum",
    url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=60",
  },
  {
    label: "Treatment",
    url: "https://images.unsplash.com/photo-1608248597359-216e453fa844?w=300&auto=format&fit=crop&q=60",
  },
  {
    label: "Tool",
    url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=60",
  },
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
  const [stockInput, setStockInput] = useState<string>(
    initialValues.stock !== undefined ? String(initialValues.stock) : "10",
  );
  const [lowStockInput, setLowStockInput] = useState<string>(
    initialValues.lowStockLevel !== undefined
      ? String(initialValues.lowStockLevel)
      : "5",
  );
  const [costPriceInput, setCostPriceInput] = useState<string>(
    initialValues.costPrice > 0 ? String(initialValues.costPrice) : "",
  );
  const [sellingPriceInput, setSellingPriceInput] = useState<string>(
    initialValues.sellingPrice > 0 ? String(initialValues.sellingPrice) : "",
  );

  const [categoriesList, setCategoriesList] = useState<Array<{ value: string; label: string }>>(categoryOptions);

  useEffect(() => {
    let isMounted = true;
    productsService
      .getCategories()
      .then((cats) => {
        if (!isMounted || !Array.isArray(cats) || cats.length === 0) return;
        const validCats = cats
          .filter((c) => c.value !== "all" && c.active !== false)
          .map((c) => ({ value: c.value, label: c.label }));
        if (validCats.length > 0) {
          if (formData.category && !validCats.some((c) => c.value === formData.category)) {
            validCats.unshift({
              value: formData.category,
              label: formData.category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            });
          }
          setCategoriesList(validCats);
          if (!formData.category) {
            setFormData((prev) => ({ ...prev, category: validCats[0].value }));
          }
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [formData.category]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^\d+$/.test(val)) {
      setStockInput(val);
      const num = parseInt(val, 10);
      setFormData((prev) => ({
        ...prev,
        stock: isNaN(num) ? 0 : num,
      }));
    }
  };

  const handleLowStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^\d+$/.test(val)) {
      setLowStockInput(val);
      const num = parseInt(val, 10);
      setFormData((prev) => ({
        ...prev,
        lowStockLevel: isNaN(num) ? 0 : num,
      }));
    }
  };

  const handleCostPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setCostPriceInput(val);
      const num = parseFloat(val);
      setFormData((prev) => ({
        ...prev,
        costPrice: isNaN(num) ? 0 : num,
      }));
    }
  };

  const handleSellingPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setSellingPriceInput(val);
      const num = parseFloat(val);
      setFormData((prev) => ({
        ...prev,
        sellingPrice: isNaN(num) ? 0 : num,
      }));
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }
    try {
      setIsUploading(true);
      const compressedDataUrl = await compressImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
    } catch {
      alert("Failed to process the image. Please try another file.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generateSku = () => {
    const prefix = formData.category.slice(0, 3).toUpperCase() || "PRD";
    const random = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, sku: `${prefix}-${random}` }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim()) return;

    const finalStock = stockInput === "" ? 0 : parseInt(stockInput, 10) || 0;
    const finalLowStock =
      lowStockInput === "" ? 5 : parseInt(lowStockInput, 10) || 5;
    const finalCostPrice =
      costPriceInput === "" ? 0 : parseFloat(costPriceInput) || 0;
    const finalSellingPrice =
      sellingPriceInput === "" ? 0 : parseFloat(sellingPriceInput) || 0;

    onSubmit({
      ...formData,
      stock: finalStock,
      lowStockLevel: finalLowStock,
      costPrice: finalCostPrice,
      sellingPrice: finalSellingPrice,
    });
    onClose();
  };

  const profit = Math.max(0, formData.sellingPrice - formData.costPrice);
  const marginPercent =
    formData.sellingPrice > 0
      ? Math.round((profit / formData.sellingPrice) * 100)
      : 0;

  return (
    <form
      id="product-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 text-xs"
    >
      {/* Section 1: Product Information */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Layers className="size-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Product Information
          </h3>
        </div>

        <Input
          type="text"
          required
          label={<>Product Name <span className="text-rose-500">*</span></>}
          labelClassName="block mb-0 font-medium text-slate-700"
          placeholder="e.g. Moroccan Argan Repair Shampoo (500ml)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-white px-3 py-2 text-xs focus:border-primary focus:ring-1 focus:ring-primary"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            type="text"
            required
            label={
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-slate-700">
                  SKU / Product Code <span className="text-rose-500">*</span>
                </span>
                <Button
                  type="button"
                  onClick={generateSku}
                  className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline cursor-pointer"
                >
                  <Sparkles className="size-3" />
                  Generate
                </Button>
              </div>
            }
            labelClassName="w-full"
            placeholder="e.g. SHP-ARG-01"
            value={formData.sku}
            onChange={(e) =>
              setFormData({ ...formData, sku: e.target.value })
            }
            className="font-mono bg-white px-3 py-2 text-xs focus:border-primary focus:ring-1 focus:ring-primary"
          />

          <div>
            <label className="block mb-1 font-medium text-slate-700">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {categoriesList.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          type="text"
          label={
            <>
              Brand / Manufacturer{" "}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </>
          }
          labelClassName="block mb-0 font-medium text-slate-700"
          placeholder="e.g. Moroccanoil, Olaplex, L'Oreal"
          value={formData.brand}
          onChange={(e) =>
            setFormData({ ...formData, brand: e.target.value })
          }
          className="bg-white px-3 py-2 text-xs focus:border-primary focus:ring-1 focus:ring-primary"
        />

        <div>
          <label className="block mb-1 font-medium text-slate-700">
            Description{" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Key benefits, usage instructions, or volume..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Product Image (Upload 1 Image) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-medium text-slate-700">
              Product Image{" "}
              <span className="text-slate-400 font-normal">(1 Image)</span>
            </label>
            <Button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[11px] font-medium text-primary hover:underline cursor-pointer flex items-center gap-1"
            >
              <Link2 className="size-3" />
              <span>{showUrlInput ? "Upload File" : "Paste URL"}</span>
            </Button>
          </div>

          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            wrapperClassName="hidden"
          />

          {formData.imageUrl ? (
            /* Uploaded Image Preview Card */
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
                  <img
                    src={formData.imageUrl}
                    alt="Product preview"
                    className="size-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    1 image selected
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {formData.imageUrl.startsWith("data:")
                      ? "Uploaded from device"
                      : formData.imageUrl}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition shadow-2xs"
                >
                  Change
                </Button>
                <Button
                  type="button"
                  onClick={handleRemoveImage}
                  className="rounded-md p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition"
                  title="Remove image"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ) : showUrlInput ? (
            /* Direct URL Mode */
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com/product.jpg"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="bg-white px-3 py-2 text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-medium">
                  Quick presets:
                </span>
                {sampleImagePresets.map((preset) => (
                  <Button
                    key={preset.label}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, imageUrl: preset.url })
                    }
                    className="rounded bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600 transition cursor-pointer"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            /* Upload Dropzone (Default) */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed transition cursor-pointer ${
                isDragging
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-slate-200 hover:border-primary/50 bg-slate-50/50 hover:bg-slate-50 text-slate-600"
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-1.5 py-1">
                  <Loader2 className="size-6 animate-spin text-primary" />
                  <span className="text-xs font-medium text-slate-600">
                    Optimizing image...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary-lighter text-primary">
                    <Upload className="size-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      PNG, JPG or WEBP (1 image, auto-optimized)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
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
          <Input
            type="text"
            inputMode="decimal"
            required
            label={<>Cost Price (Purchase Price) <span className="text-rose-500">*</span></>}
            labelClassName="block mb-0 font-medium text-slate-700"
            placeholder="0.00"
            value={costPriceInput}
            onChange={handleCostPriceChange}
            leftElement={<span className="text-slate-400 font-medium text-xs">Rs.</span>}
            className="bg-white py-2 text-xs focus:border-primary focus:ring-1 focus:ring-primary"
          />

          <Input
            type="text"
            inputMode="decimal"
            required
            label={<>Selling Price (Retail Price) <span className="text-rose-500">*</span></>}
            labelClassName="block mb-0 font-medium text-slate-700"
            placeholder="0.00"
            value={sellingPriceInput}
            onChange={handleSellingPriceChange}
            leftElement={<span className="text-slate-400 font-medium text-xs">Rs.</span>}
            className="bg-white py-2 text-xs focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Profit Preview Pill */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100">
          <span className="text-[11px] text-slate-500">
            Estimated Unit Profit:
          </span>
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
              {isEditing ? "Stock Quantity" : "Initial Stock Quantity"}{" "}
              <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-1.5">
              <Input
                type="text"
                inputMode="numeric"
                required
                placeholder="0"
                value={stockInput}
                onChange={handleStockChange}
                className="bg-white px-3 py-2 text-xs focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {isEditing && (
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    onClick={() => {
                      const next = (parseInt(stockInput, 10) || 0) + 1;
                      setStockInput(String(next));
                      setFormData((prev) => ({ ...prev, stock: next }));
                    }}
                    className="rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2 py-2 text-[11px] font-medium text-slate-700 transition cursor-pointer"
                    title="Add 1 to stock"
                  >
                    +1
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      const next = (parseInt(stockInput, 10) || 0) + 5;
                      setStockInput(String(next));
                      setFormData((prev) => ({ ...prev, stock: next }));
                    }}
                    className="rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2 py-2 text-[11px] font-medium text-slate-700 transition cursor-pointer"
                    title="Add 5 to stock"
                  >
                    +5
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      const next = (parseInt(stockInput, 10) || 0) + 10;
                      setStockInput(String(next));
                      setFormData((prev) => ({ ...prev, stock: next }));
                    }}
                    className="rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2 py-2 text-[11px] font-medium text-slate-700 transition cursor-pointer"
                    title="Add 10 to stock"
                  >
                    +10
                  </Button>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {isEditing
                ? "Enter new total or use quick + buttons to add incoming stock"
                : "Available items in salon storage"}
            </span>
          </div>

          <Input
            type="text"
            inputMode="numeric"
            required
            label={<>Low Stock Alert Level <span className="text-rose-500">*</span></>}
            labelClassName="block mb-0 font-medium text-slate-700"
            placeholder="5"
            value={lowStockInput}
            onChange={handleLowStockChange}
            helperText="Triggers warning when stock drops to or below this"
            className="bg-white px-3 py-2 text-xs focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Section 4: Status (Enable / Disable Toggle Switch) */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex items-center justify-between gap-3">
        <div
          className="flex items-center gap-3 cursor-pointer select-none min-w-0"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              status: prev.status === "active" ? "inactive" : "active",
            }))
          }
        >
          <div
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
              formData.status === "active"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            <Power className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900">
                Product Status
              </h4>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                  formData.status === "active"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    formData.status === "active"
                      ? "bg-emerald-500"
                      : "bg-slate-400"
                  }`}
                />
                {formData.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {formData.status === "active"
                ? "Product is enabled and available for sales in POS"
                : "Product is disabled and hidden from sales"}
            </p>
          </div>
        </div>

        <Button
          type="button"
          role="switch"
          aria-checked={formData.status === "active"}
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              status: prev.status === "active" ? "inactive" : "active",
            }))
          }
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            formData.status === "active" ? "bg-emerald-500" : "bg-slate-300"
          }`}
          title={
            formData.status === "active"
              ? "Click to disable product"
              : "Click to enable product"
          }
        >
          <span
            className={`inline-block size-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
              formData.status === "active"
                ? "translate-x-5.5"
                : "translate-x-0.5"
            }`}
          />
        </Button>
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
        category: "",
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
      <Button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="product-form"
        className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-dark cursor-pointer"
      >
        {isEditing ? "Save Changes" : "Add Product"}
      </Button>
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
      size="xl"
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

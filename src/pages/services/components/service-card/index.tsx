import { Clock, Edit3, Check, X, Sparkles, Image as ImageIcon } from "lucide-react";
import type { ServiceItem, ServiceCategoryItem } from "../../../../interface/service.types";
import { formatPrice } from "../../../../helpers/price.helper";

export type ServiceCardProps = {
  service: ServiceItem;
  categories?: ServiceCategoryItem[];
  onToggleStatus: (id: string) => void;
  onEdit: (service: ServiceItem) => void;
};

const categoryBadges: Record<string, { label: string; style: string }> = {
  hair: { label: "Hair Care", style: "bg-rose-50 text-rose-700 border-rose-200" },
  skin: { label: "Skin & Facial", style: "bg-blue-50 text-blue-700 border-blue-200" },
  nails: { label: "Nails", style: "bg-purple-50 text-purple-700 border-purple-200" },
  spa: { label: "Spa & Massage", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  makeup: { label: "Bridal & Glam", style: "bg-amber-50 text-amber-700 border-amber-200" },
};

export function ServiceCard({
  service,
  categories,
  onToggleStatus,
  onEdit,
}: ServiceCardProps) {
  const predefinedBadge = categoryBadges[service.category];
  const matchedCategory = categories?.find((c) => c.value === service.category);
  const badge = predefinedBadge || {
    label: matchedCategory ? matchedCategory.label : service.category,
    style: "bg-slate-50 text-slate-700 border-slate-200",
  };

  const images = service.images || [];
  const coverImage = images[0];

  return (
    <article className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-xs transition hover:border-primary-lighter hover:shadow-md overflow-hidden">
      <div>
        {/* Cover Image if present */}
        {coverImage && (
          <div className="relative mb-3 aspect-[16/10] w-full overflow-hidden rounded-lg bg-slate-100">
            <img
              src={coverImage}
              alt={service.name}
              className="size-full object-cover transition duration-300 group-hover:scale-105"
            />
            {images.length > 1 && (
              <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                <ImageIcon className="size-3" />
                <span>+{images.length - 1}</span>
              </span>
            )}
          </div>
        )}

        {/* Top badges */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${badge.style}`}
          >
            {badge.label}
          </span>
          <div className="flex items-center gap-1.5">
            {service.popular && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-lighter px-2 py-0.5 text-[10px] font-semibold text-primary">
                <Sparkles className="size-3" />
                Popular
              </span>
            )}
            <span
              className={`inline-block size-2 rounded-full ${
                service.isActive ? "bg-emerald-500" : "bg-slate-300"
              }`}
              title={service.isActive ? "Active service" : "Inactive"}
            />
          </div>
        </div>

        {/* Title and description */}
        <h3 className="mt-2.5 text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">
          {service.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
          {service.description}
        </p>
      </div>

      {/* Footer details: duration, price, and actions */}
      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="size-3.5 text-slate-400" />
            <span>{service.durationMinutes} mins</span>
          </div>
          <div className="text-base font-bold text-slate-900">
            {formatPrice(service.price)}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-dashed border-slate-100 text-xs">
          <button
            type="button"
            onClick={() => onToggleStatus(service.id)}
            className={`flex items-center gap-1 text-[11px] font-medium transition cursor-pointer ${
              service.isActive
                ? "text-slate-500 hover:text-rose-600"
                : "text-emerald-600 hover:underline"
            }`}
          >
            {service.isActive ? (
              <>
                <X className="size-3" />
                <span>Deactivate</span>
              </>
            ) : (
              <>
                <Check className="size-3" />
                <span>Activate</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onEdit(service)}
            className="flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary-dark transition cursor-pointer"
          >
            <Edit3 className="size-3" />
            <span>Edit</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default ServiceCard;

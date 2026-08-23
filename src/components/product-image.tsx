import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Renders the first real product photo when one exists, falling back to the
// category-icon-on-gradient placeholder used everywhere before Cloudinary
// was wired up. One shared component so the fallback stays visually
// identical across the storefront card, product detail page, and admin
// table thumbnail.
export function ProductImage({
  src,
  alt,
  icon: Icon,
  className,
  iconClassName,
  sizes,
}: {
  src?: string | null;
  alt: string;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-accent/20 via-accent/5 to-brand/10",
        className
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <Icon className={cn("text-muted-foreground", iconClassName)} strokeWidth={1.25} />
      )}
    </div>
  );
}

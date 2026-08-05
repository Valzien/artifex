import { Link } from "react-router-dom";
import { Package, Download, Video } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/constants/orderStatus";

function isAvatarUrl(value) {
  return typeof value === "string" && /^(https?:\/\/|\/|data:)/.test(value);
}

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`}>
      <Card className="p-0 overflow-hidden transition-shadow hover:shadow-md group cursor-pointer">
        <div className="aspect-video relative bg-surface flex items-center justify-center">
          {product.previews?.[0] ? (
            product.previews[0].type === "video" ? (
              <div className="flex items-center gap-2 text-ink/40">
                <Video className="h-8 w-8" />
                <span className="text-xs">Video Preview</span>
              </div>
            ) : (
              <img src={product.previews[0].url} alt={product.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            )
          ) : (
            <Package className="h-10 w-10 text-ink/15" />
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="primary" className="bg-surface/90">{formatCurrency(product.price)}</Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-ink line-clamp-1 group-hover:text-primary transition-colors">{product.title}</h3>
          <p className="mt-1 text-xs text-ink/50 line-clamp-2">{product.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-ink/50">
              {isAvatarUrl(product.freelancer?.avatar) ? (
                <img
                  src={product.freelancer.avatar}
                  alt={product.freelancer?.name}
                  loading="lazy"
                  decoding="async"
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
                  {product.freelancer?.name?.[0]}
                </div>
              )}
              <span>{product.freelancer?.name}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-ink/40">
              <Download className="h-3 w-3" />
              {product.downloads ?? 0}
            </div>
          </div>
          {product.category && (
            <Badge variant="neutral" className="mt-2">{product.category}</Badge>
          )}
        </div>
      </Card>
    </Link>
  );
}

export default ProductCard;

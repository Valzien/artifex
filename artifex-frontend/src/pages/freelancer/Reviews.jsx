import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ReviewCard } from "@/components/shared/ReviewCard";
import { getFreelancerReviews } from "@/services/api/freelancerReviews";

function ReviewSkeleton() {
  return (
    <Card className="space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </Card>
  );
}

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getFreelancerReviews().then((data) => { if (mounted) { setReviews(data); setIsLoading(false); } });
    return () => (mounted = false);
  }, []);

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Ulasan</h2>
          <p className="mt-1 text-sm text-ink/60">Apa kata klien tentang kerja kamu.</p>
        </div>
        {!isLoading && (
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <span className="text-lg font-semibold text-ink">{avgRating}</span>
            <span className="text-sm text-ink/50">({reviews.length})</span>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <>
            <ReviewSkeleton />
            <ReviewSkeleton />
            <ReviewSkeleton />
          </>
        ) : reviews.length === 0 ? (
          <Card className="py-12 text-center">
            <p className="text-sm text-ink/50">Belum ada ulasan.</p>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="px-6 py-4">
              <ReviewCard review={review} showAvatar={true} />
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default Reviews;

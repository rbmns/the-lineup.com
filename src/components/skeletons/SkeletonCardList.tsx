
import { Skeleton } from "@/components/ui/skeleton";
import SkeletonCard from "./SkeletonCard";

export const SkeletonCardList = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array(count).fill(null).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default SkeletonCardList;

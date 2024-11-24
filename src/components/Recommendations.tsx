import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  fetchRecommendations,
  RecommendationFilter,
} from "../lib/recommendations";

const recommendationQueryKeys = {
  all: () => ["recommendations"] as const,
  list: (filter: RecommendationFilter) =>
    [...recommendationQueryKeys.all(), filter] as const,
};

export default function Recommendations() {
  const [recommendedById, setRecommendedById] = useState<string>();
  const [recommendedToId, setRecommendedToId] = useState<string>();

  const {
    data: recommendations,
    isLoading,
    error,
  } = useQuery({
    queryKey: recommendationQueryKeys.list({
      recommendedById,
      recommendedToId,
    }),
    queryFn: ({ queryKey }) => fetchRecommendations(queryKey[1]),
  });

  if (!recommendations || isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <ul className="space-y-2">
      <form onSubmit={() => {}} className="flex gap-4">
        <input
          name="recommendedById"
          value={recommendedById}
          onChange={(e) => setRecommendedById(e.target.value)}
          placeholder="Recommended By"
          className="border rounded px-2 py-1 w-full"
        />
        <input
          name="recommendedToId"
          value={recommendedToId}
          onChange={(e) => setRecommendedToId(e.target.value)}
          placeholder="Recommended To"
          className="border rounded px-2 py-1 w-full"
        />
      </form>
      {recommendations.map((recommendation) => (
        <li key={recommendation.id} className="bg-white shadow rounded-lg p-2">
          <h4 className="font-semibold">{recommendation.book?.title}</h4>
          <p className="text-sm text-gray-600">
            {recommendation.recommendedBy?.name ?? "Unknown"}
          </p>
          <p className="text-sm text-gray-600">{recommendation.message}</p>
        </li>
      ))}
    </ul>
  );
}

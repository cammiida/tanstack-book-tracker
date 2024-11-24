import { Recommendation } from "../mocks/recommendationHandlers";

export type RecommendationFilter = {
  recommendedToId?: string;
  recommendedById?: string;
};

export async function fetchRecommendations(
  search: RecommendationFilter | undefined
): Promise<Recommendation[]> {
  const searchParams = new URLSearchParams(search);
  const response = await fetch(
    ["/api/recommendations", searchParams.toString()].join("?")
  );

  return await response.json();
}

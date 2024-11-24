import { http, HttpHandler, HttpResponse } from "msw";

import { z } from "zod";
import { User } from "../lib/users";
import { users } from "./userHandlers";
import { Book } from "../lib/books";
import { books } from "./bookHandlers";

export const recommendationSchema = z.object({
  id: z.string(),
  bookId: z.string(),
  recommendedById: z.string(),
  recommendedToId: z.string(),
  message: z.string(),
});

export type RecommendationRow = z.infer<typeof recommendationSchema>;

export type Recommendation = {
  id: string;
  book: Book | undefined;
  recommendedBy: User | undefined;
  message: string;
};

export const recommendationHandlers: HttpHandler[] = [
  http.get("/api/recommendations/:id", ({ params }) => {
    const { id } = params;

    const recommendationsForUser: Recommendation[] = recommendations
      .filter((recommendation) => recommendation.recommendedToId === id)
      .map((recommendation) => {
        const book = books.find((book) => book.id === recommendation.bookId);
        if (!book) {
          return null;
        }

        const recommendedBy = users.find(
          (user) => user.id === recommendation.recommendedById
        );

        return {
          id: recommendation.id,
          book,
          recommendedBy,
          message: recommendation.message,
        } satisfies Recommendation;
      })
      .filter((it) => it !== null);

    return HttpResponse.json(recommendationsForUser);
  }),
];

const recommendations: RecommendationRow[] = [
  {
    id: "1",
    bookId: "1",
    recommendedById: "1",
    recommendedToId: "2",
    message: "This is a great book!",
  },
  {
    id: "2",
    bookId: "2",
    recommendedById: "2",
    recommendedToId: "1",
    message: "You will love this book!",
  },
  {
    id: "3",
    bookId: "3",
    recommendedById: "1",
    recommendedToId: "3",
    message: "This is a must-read!",
  },
  {
    id: "4",
    bookId: "4",
    recommendedById: "3",
    recommendedToId: "1",
    message: "You will not be able to put this book down!",
  },
  {
    id: "5",
    bookId: "5",
    recommendedById: "2",
    recommendedToId: "3",
    message: "This book is life-changing!",
  },
];

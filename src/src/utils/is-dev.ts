export const isDev =
  process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";

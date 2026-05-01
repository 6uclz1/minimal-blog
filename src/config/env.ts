export type AppEnv = {
  nodeEnv: string;
};

export const loadEnv = (): AppEnv => ({
  nodeEnv: process.env.NODE_ENV ?? "development",
});

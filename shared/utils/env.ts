export const env = {
  CLIENT_ID: import.meta.env.VITE_YNAB_CLIENT_ID as string,
  WORKER_URL: import.meta.env.VITE_WORKER_URL as string
};

export default env;

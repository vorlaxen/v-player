const env = import.meta.env;

const rawSiteName = String(env.VITE_APP_NAME || '');
const siteName = rawSiteName.charAt(0).toUpperCase() + rawSiteName.slice(1);

function must<T>(value: T | undefined | '', name: string): T {
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const AppConfig = {
  apiUrl: must(env.VITE_API_BASE_URL, 'VITE_API_BASE_URL') || '',
  appDomain: must(env.VITE_APP_DOMAIN, 'VITE_APP_DOMAIN') || '',
  siteName: siteName
};

export const Runtime = {
  environment: must(env.VITE_NODE_ENV, 'NODE_ENV'),
};

export const Server = {
  port: Number(env.SERVER_PORT) || 3000,
};
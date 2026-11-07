// Declare Vite environment variable types so import.meta.env works with or without node_modules installed
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


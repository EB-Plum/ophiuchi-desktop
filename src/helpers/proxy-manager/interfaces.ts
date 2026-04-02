export type IProxyData = {
  nickname: string;
  hostname: string;
  port: number;
  createdAt: string;
  canLaunch?: boolean;
};

export type IProxyGroupData = {
  id: string;
  name: string;
  isNoGroup: boolean; // true if this is the total proxy list
  includedHosts: (string | IProxyData)[];
  createdAt: string;
  updatedAt: string;
};

export type INginxSettings = {
  proxyBufferSize: string; // e.g. "8k"
  proxyBuffers: string; // e.g. "8 8k"
  largeClientHeaderBuffers: string; // e.g. "4 16k"
};

export const DEFAULT_NGINX_SETTINGS: INginxSettings = {
  proxyBufferSize: "8k",
  proxyBuffers: "8 8k",
  largeClientHeaderBuffers: "4 16k",
};

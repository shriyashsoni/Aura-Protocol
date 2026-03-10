import { config } from "./config";

export async function queryAleoProgram(programId: string, endpoint: string, params: Record<string, any> = {}) {
  const url = `${config.aleoRpcUrl}/program/${programId}/${endpoint}`;
  const search = new URLSearchParams(params).toString();
  const fullUrl = search ? `${url}?${search}` : url;
  const res = await fetch(fullUrl);
  if (!res.ok) throw new Error(`Aleo RPC error: ${res.status}`);
  return res.json();
}

// Example usage:
// const result = await queryAleoProgram(config.programs.dataMarket, "state", { key: "listing_id" });

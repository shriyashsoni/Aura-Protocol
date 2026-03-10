// Health check route logic
export function healthCheck() {
  return { success: true, status: "ok", timestamp: new Date().toISOString() };
}

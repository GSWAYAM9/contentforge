// Client-side auth helpers (mainly for redirects in auth pages)
// Actual auth is managed server-side via JWT in cookies

export function useAuth() {
  // This would be implemented with a context or SWR hook in a full app
  // For now, sessions are validated server-side
  return {
    isLoading: false,
  }
}

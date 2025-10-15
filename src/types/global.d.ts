// Global type declarations

declare module 'phoenix' {
  // Minimal phoenix types to avoid errors
  export interface Socket {
    connect(): void
    disconnect(): void
  }
  
  export interface Channel {
    join(): void
    leave(): void
  }
}

// Extend global types if needed
declare global {
  interface Window {
    // Add any global window properties here if needed
  }
}

export {}
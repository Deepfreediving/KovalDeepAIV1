// src/declarations.d.ts
declare module 'ai/react' {
  export interface Message {
    role: string;
    content: string;
  }

  export function useChat(): any;
}

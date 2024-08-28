// requestStore.ts
import create from "zustand";

type Request = {
  url: string;
  method: string;
  body?: any;
  response: any;
  status: number;
};

interface RequestStore {
  requests: Request[];
  addRequest: (request: Request) => void;
}

export const useRequestStore = create<RequestStore>((set) => ({
  requests: [],
  addRequest: (request) =>
    set((state) => ({
      requests: [...state.requests, request],
    })),
}));

export const fetcher = (route: string, init?: RequestInit) =>
  fetch(`http://localhost:3100/api/${route}`, init).then((res) => res.json());

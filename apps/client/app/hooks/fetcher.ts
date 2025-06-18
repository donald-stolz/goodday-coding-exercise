export const fetcher = (route: string) =>
  fetch(`http://localhost:3100/api/${route}`).then((res) => res.json());

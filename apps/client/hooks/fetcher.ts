// Utility to convert snake_case to camelCase
const toCamelCase = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const convertKeysToCamelCase = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(convertKeysToCamelCase);
  }
  if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        toCamelCase(key),
        convertKeysToCamelCase(value),
      ])
    );
  }
  return data;
};

export const fetcher = (route: string) =>
  fetch(`http://localhost:3100/api/${route}`).then((res) => res.json());

export const fetcherWithCamelCase = (route: string) =>
  fetch(`http://localhost:3100/api/${route}`)
    .then((res) => res.json())
    .then(convertKeysToCamelCase);

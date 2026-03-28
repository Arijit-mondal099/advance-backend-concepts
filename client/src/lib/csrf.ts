let csrfToken = "";

export const getCsrfToken = () => csrfToken;
export const setCsrfToken = (t: string) => { csrfToken = t };

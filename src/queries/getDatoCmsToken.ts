// getDatoCmsToken.ts

export const getDatoCmsToken = (): string => {
  return process.env.REACT_APP_DATOCMSTOKEN_DEFAULT  ?? '';
};

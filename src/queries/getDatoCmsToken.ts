// getDatoCmsToken.ts

export const getDatoCmsToken = (): string => {

  return process.env.DATOCMSTOKEN_DEFAULT ?? '';
};

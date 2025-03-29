// getDatoCmsToken.ts

export const getDatoCmsToken = (): string => {

  return process.env.DATODMSTOKEN_DEFAULT ?? '';
};

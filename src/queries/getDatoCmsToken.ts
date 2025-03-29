// getDatoCmsToken.ts

export const getDatoCmsToken = (): string => {
  console.log("BRUHHH", process.env.REACT_APP_DATOCMSTOKEN_DEFAULT)
  return process.env.REACT_APP_DATOCMSTOKEN_DEFAULT  ?? '';
};

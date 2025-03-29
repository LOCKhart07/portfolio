// getDatoCmsToken.ts

export const getDatoCmsToken = (): string => {
  const hostname = window.location.hostname;

  switch (hostname) {
    case 'ror.sumanthsamala.com':
    case 'sumanthsamala.com':
    case 'ror.localhost':
    case 'localhost':
      return process.env.REACT_APP_ROR_TOKEN ?? '';

    case 'java.sumanthsamala.com':
    case 'java.localhost':
      return process.env.REACT_APP_JAVA_TOKEN ?? '';

    case 'frontend.sumanthsamala.com':
    case 'frontend.localhost':
      return process.env.REACT_APP_FRONTEND_TOKEN ?? '';

    case 'node.sumanthsamala.com':
    case 'node.localhost':
      return process.env.REACT_APP_NODE_TOKEN ?? '';

    default:
      throw new Error(`No DatoCMS token configured for hostname: ${hostname}`);
  }
};

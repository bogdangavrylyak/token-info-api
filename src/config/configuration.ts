import { env } from './env';

export default () => ({
  env: env.string('ENV'),
  server: {
    port: env.int('PORT', 3000),
  },
  providerUrl: env.string('PROVIDER_URL'),
});

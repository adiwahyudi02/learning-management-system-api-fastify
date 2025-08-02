import { Static, Type } from '@sinclair/typebox';

export const healthcheckResponseSchema = Type.Object({
  ok: Type.Boolean(),
});

export type HealthcheckResponse = Static<typeof healthcheckResponseSchema>;

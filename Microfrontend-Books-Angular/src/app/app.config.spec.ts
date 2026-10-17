import { appConfig } from './app.config';

describe('appConfig', () => {
  it('debe registrar los providers de ejecución independiente', () => {
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });
});

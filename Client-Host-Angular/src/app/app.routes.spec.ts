import { routes } from './app.routes';
import { loadRemoteModule } from '@angular-architects/module-federation';

// Mock de @angular-architects/module-federation
jest.mock('@angular-architects/module-federation', () => ({
  loadRemoteModule: jest.fn(),
}));

describe('App Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should define the routes for books, members, loans and wildcard', () => {
    const paths = routes.map((r) => r.path);
    expect(paths).toContain('books');
    expect(paths).toContain('members');
    expect(paths).toContain('loans');
    expect(paths).toContain('**');
  });

  it('should redirect wildcard (**) to books', () => {
    const wildcardRoute = routes.find((r) => r.path === '**');
    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.redirectTo).toBe('books');
    expect(wildcardRoute?.pathMatch).toBe('full');
  });

  it('should load remote module for "books"', async () => {
    const fakeComponent = class BooksPage {};
    (loadRemoteModule as jest.Mock).mockResolvedValue({ BooksPage: fakeComponent });

    const route = routes.find((r) => r.path === 'books');
    expect(route).toBeDefined();
    expect(route?.loadComponent).toBeDefined();

    if (route?.loadComponent) {
      const comp = await (route.loadComponent as Function)();
      expect(comp).toBe(fakeComponent);
      expect(loadRemoteModule).toHaveBeenCalledWith({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './BooksPage',
      });
    }
  });

  it('should load remote module for "members"', async () => {
    const fakeComponent = class MembersPage {};
    (loadRemoteModule as jest.Mock).mockResolvedValue({ MembersPage: fakeComponent });

    const route = routes.find((r) => r.path === 'members');
    expect(route).toBeDefined();
    expect(route?.loadComponent).toBeDefined();

    if (route?.loadComponent) {
      const comp = await (route.loadComponent as Function)();
      expect(comp).toBe(fakeComponent);
      expect(loadRemoteModule).toHaveBeenCalledWith({
        type: 'module',
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        exposedModule: './MembersPage',
      });
    }
  });

  it('should load remote module for "loans"', async () => {
    const fakeComponent = class LoansPage {};
    (loadRemoteModule as jest.Mock).mockResolvedValue({ LoansPage: fakeComponent });

    const route = routes.find((r) => r.path === 'loans');
    expect(route).toBeDefined();
    expect(route?.loadComponent).toBeDefined();

    if (route?.loadComponent) {
      const comp = await (route.loadComponent as Function)();
      expect(comp).toBe(fakeComponent);
      expect(loadRemoteModule).toHaveBeenCalledWith({
        type: 'module',
        remoteEntry: 'http://localhost:4203/remoteEntry.js',
        exposedModule: './LoansPage',
      });
    }
  });
});

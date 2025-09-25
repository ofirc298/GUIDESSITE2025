// Safe authentication utilities that avoid NextAuth issues

// Mock session for development/fallback
interface MockSession {
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
  expires: string;
}

// Safe session management that doesn't rely on NextAuth's problematic areas
class SafeAuthManager {
  private mockSessions: Map<string, MockSession> = new Map();

  constructor() {
    // Initialize with demo users for development
    this.mockSessions.set('demo@site.com', {
      user: {
        id: '1',
        email: 'demo@site.com',
        name: 'Demo User',
        role: 'STUDENT'
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });

    this.mockSessions.set('admin@site.com', {
      user: {
        id: '2',
        email: 'admin@site.com',
        name: 'Admin User',
        role: 'ADMIN'
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });

    tracer.info('safe-auth', 'SafeAuthManager initialized', { 
      mockSessionsCount: this.mockSessions.size 
    });
  }

  // Safe session retrieval that works in any context
  async getSafeSession(): Promise<MockSession | null> {
    tracer.debug('safe-auth', 'getSafeSession called');

    try {
      // Try to get session from NextAuth if possible
      const { getServerSession } = await import('next-auth');
      const { getAuthOptions } = await import('@/lib/auth/options');
      
      tracer.debug('safe-auth', 'Attempting NextAuth session retrieval');
      const session = await getServerSession(getAuthOptions());
      
      if (session) {
        tracer.info('safe-auth', 'NextAuth session retrieved successfully');
        return session as MockSession;
      }
    } catch (error) {
      tracer.error('safe-auth', 'NextAuth session retrieval failed', {
        error: (error as Error).message,
        stack: (error as Error).stack
      });
    }

    // Fallback to mock session for development
    tracer.info('safe-auth', 'Using fallback mock session');
    return null; // Return null for now, can be enhanced with actual session logic
  }

  // Authenticate user safely
  async authenticateUser(email: string, password: string): Promise<MockSession | null> {
    tracer.info('safe-auth', 'Authentication attempt', { email });

    // Simple demo authentication
    if (email === 'demo@site.com' && password === 'demo123') {
      const session = this.mockSessions.get(email);
      tracer.info('safe-auth', 'Authentication successful', { email, role: session?.user.role });
      return session || null;
    }

    if (email === 'admin@site.com' && password === 'admin123') {
      const session = this.mockSessions.get(email);
      tracer.info('safe-auth', 'Admin authentication successful', { email, role: session?.user.role });
      return session || null;
    }

    tracer.warn('safe-auth', 'Authentication failed', { email });
    return null;
  }

  // Get user role safely
  async getUserRole(): Promise<string> {
    const session = await this.getSafeSession();
    const role = session?.user?.role || 'GUEST';
    tracer.debug('safe-auth', 'User role retrieved', { role });
    return role;
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSafeSession();
    const isAuth = !!session;
    tracer.debug('safe-auth', 'Authentication check', { isAuthenticated: isAuth });
    return isAuth;
  }

  // Check if user has specific role
  async hasRole(requiredRole: string): Promise<boolean> {
    const userRole = await this.getUserRole();
    const hasRole = userRole === requiredRole || userRole === 'ADMIN';
    tracer.debug('safe-auth', 'Role check', { userRole, requiredRole, hasRole });
    return hasRole;
  }
}

// Export singleton instance
export const safeAuth = new SafeAuthManager();

// Wrapped functions with error boundaries
export const getSafeSession = withErrorBoundary(
  () => safeAuth.getSafeSession(),
  'getSafeSession'
);

export const authenticateUser = withErrorBoundary(
  (email: string, password: string) => safeAuth.authenticateUser(email, password),
  'authenticateUser'
);

export const getUserRole = withErrorBoundary(
  () => safeAuth.getUserRole(),
  'getUserRole'
);

export const isAuthenticated = withErrorBoundary(
  () => safeAuth.isAuthenticated(),
  'isAuthenticated'
);

export const hasRole = withErrorBoundary(
  (role: string) => safeAuth.hasRole(role),
  'hasRole'
);
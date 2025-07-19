# AI Agent Instructions for Teacher Report NRA

This is a React Admin + NestJS application with MySQL database for managing teacher reports. The application supports Hebrew RTL interface and is deployed via Docker.

## Architecture Overview

### Technology Stack
- **Frontend**: React Admin, Vite, Material-UI, React 18 with RTL Hebrew support
- **Backend**: NestJS, TypeORM, MySQL, JWT authentication
- **Testing**: Jest for both frontend and backend
- **Deployment**: Docker Compose

### Directory Structure
- `client/` - React Admin frontend application
- `server/` - NestJS backend API
- `client/shared/`, `server/shared/` - Git submodules with shared components
- `db/` - Database initialization scripts
- `.github/workflows/` - CI/CD workflows

## Development Flow

### Required Before Each Commit
- Run `yarn lint` in server directory before committing server changes
- Test your changes with `yarn test` in respective directories
- Ensure builds complete successfully with `yarn build`

### Build Commands
- **Server**: `yarn build` (builds to `dist/` folder)
- **Client**: `yarn build` (builds to `dist/` folder with Vite)

### Test Commands  
- **Server**: `yarn test` (Jest unit tests), `yarn test:e2e` (End-to-end tests)
- **Client**: `yarn test` (Jest with React Testing Library)

### Linting
- **Server**: `yarn lint` (ESLint + Prettier with strict rules)
- Code style: 2 spaces indentation, 120 char line length, single quotes, trailing commas

## Key Guidelines

### Code Standards
1. Follow TypeScript best practices and existing patterns
2. Use 2-space indentation, single quotes, trailing commas required
3. Maintain 120-character line length limit
4. Use kebab-case for files, PascalCase for classes
5. Format with Prettier before committing

### Entity Development Pattern
**Backend (NestJS + TypeORM):**
1. Create entity in `server/src/db/entities/`
2. Add module in `server/src/entity-modules/`  
3. Register in `server/src/entities.module.ts`
4. Generate migration: `yarn typeorm:generate src/migrations/MigrationName`
5. Run migration: `yarn typeorm:run`

**Frontend (React Admin):**
1. Create component in `client/src/entities/`
2. Add resource to `client/src/App.jsx`
3. Update translations in `client/src/domainTranslations.js`

### Testing Patterns
**Server Tests (Jest + Supertest):**
```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServiceName, mockRepository],
    }).compile();
    service = module.get<ServiceName>(ServiceName);
  });
  
  it('should handle operation', async () => {
    // Test implementation with proper mocking
  });
});
```

**Client Tests (Jest + React Testing Library):**
- Test component behavior and user interactions
- Mock React Admin dependencies appropriately
- Follow existing test patterns in the repository

### Hebrew RTL Support
- All UI text must support Hebrew RTL layout
- Use translations from `client/src/domainTranslations.js`
- Ensure proper RTL styling with Material-UI components

### Database Guidelines
- Never edit existing migration files
- Always generate new migrations for schema changes: `yarn typeorm:generate`
- Test migrations on clean database before production
- Use TypeORM parameter binding for security

### Git Submodules
- Always initialize submodules: `git submodule update --init --recursive`
- Commit submodule changes separately from main repository changes
- Update submodules when pulling changes: `git submodule update --recursive`

## Important Environment Considerations

### Puppeteer Configuration
- Set `PUPPETEER_SKIP_DOWNLOAD=true` to skip Chromium download (required for firewall compliance)
- Alternative: Set `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`

### Node.js Environment
- Uses Node.js 20 with Yarn package manager
- Dependencies cached by `yarn.lock` files in both client and server directories

## Common Development Tasks

### Adding New Features
1. Design database schema changes in TypeORM entities
2. Generate and run database migrations
3. Implement NestJS API endpoints with proper validation
4. Create React Admin frontend components
5. Add Hebrew translations and RTL support
6. Write comprehensive tests for new functionality

### Debugging Steps
1. Check application logs for errors
2. Verify database connectivity and data integrity
3. Test API endpoints independently
4. Use browser dev tools for frontend debugging
5. Run linting to catch style/syntax issues

### Quality Assurance
Before submitting changes:
```bash
# Server checks
cd server
yarn lint && yarn build && yarn test

# Client checks  
cd ../client
yarn build && yarn test
```

## Security Best Practices
- Validate all user inputs with class-validator decorators
- Use TypeORM parameter binding to prevent SQL injection
- Implement proper JWT authentication and authorization
- Follow NestJS security guidelines for API endpoints

## Key Files Reference
- `server/src/main.ts` - NestJS application entry point
- `client/src/App.jsx` - React Admin app configuration
- `server/shared/config/typeorm.config.ts` - Database configuration
- `client/src/domainTranslations.js` - Hebrew UI translations
- `docker-compose.yml` - Development environment setup
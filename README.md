# Evento-Web Frontend Next.js Project

## Introduction

Welcome to the Evento Next.js project. This project aims to transition the existing Swift-based frontend to a Next.js-based Progressive Web Application (PWA). The backend remains in Express.js.

## Project Structure

- **frontend**: Contains the Next.js application.

## Prerequisites

- Node.js version 14.x or higher
- PNPM

## Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/EventoOrganization/evento_web
   cd evento-web
   ```

2. **Install dependencies**:

   ```sh
   pnpm install
   ```

3. **Create a `.env` file**:

   ```sh
   cp .env.example .env
   ```

## Usage

1. **Start the development server**:

   ```sh
   npm run dev
   ```

2. **Open your browser and go to http://localhost:3000**:

## Examples

We have included some examples to help you get started with dependencies.

- [Zod_example](https://github.com/EventoOrganization/evento_web/tree/main/examples/zod-example.ts)
- [jest_example](https://github.com/EventoOrganization/evento_web/tree/main/examples/jest-example.ts)
- [commitizen_example](https://github.com/EventoOrganization/evento_web/tree/main/examples/commitizen-example.md)

## Project Goals

- Créate a new mobile-first responsive frontend in Next.js to replace Swift.
- Maintain existing backend in Express.js.
- Implement PWA features.

## Key Features

- User authentication and management.
- Event creation and management.
- Real-time messaging.
- Progressive Web App support.
- Add More...

## Directory Structure

- public\: Static assets.
- src\components: Reusable components.
- src\app: Contains `page.tsx` and `layout.tsx`.
- src\app\globals.css: Global styles (preferably using Tailwind, use `@apply`).
- src\app\api: API routes (preferably using Express.js).
- src\lib: Library functions.

## Contributing

Please refer to [Contributing](CONTRIBUTING.md) for guidelines on contributing to this project.

## Branching and Pull Request Policy

- Branching: Create a new branch for each feature or bug fix. Name your branch using the format feature/your-feature-name or bugfix/your-bugfix-name.
- Pull Requests: Once your changes are ready, create a Pull Request (PR) to merge your branch into the main branch.
- Review and Approval: Only the repository owner can approve and merge Pull Requests. Ensure your PR is clear and provides enough context for the review.

## Code Quality Configuration

### Configuration Files

1. **.editorconfig**: Ensures coding style consistency across different text editors.
2. **.eslintrc.js**: Configures ESLint to analyze and fix code issues.
3. **.eslintignore**: Specifies files and directories to be ignored by ESLint.
4. **.prettierrc**: Configures Prettier to format the code.
5. **commitlint.config.js**: Configures commitlint to validate commit messages.
6. **lint-staged.config.js**: Configures lint-staged to run ESLint and Prettier on modified files before committing.
7. **.gitignore**: Specifies files and directories to be ignored by Git.

### Issue Models

We have provided templates to help you report bugs and request new features.

- [bug_report](.github/ISSUE_TEMPLATE/bug_report.md)
- [feature_request](.github/ISSUE_TEMPLATE/feature_request.md)

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any questions or concerns, please open an issue or contact the project maintainers.

## Useful Links

- Next.js Documentation (https://nextjs.org/docs/)
- Express.js Documentation (https://expressjs.com/en/)
- PNPM Documentation (https://pnpm.io/)

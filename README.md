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

- [Zod_example](https://github.com/EventoOrganization/evento_web/tree/main/lib/zod-example.ts)
- [jest_example](https://github.com/EventoOrganization/evento_web/tree/main/tests/jest-example.ts)

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

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any questions or concerns, please open an issue or contact the project maintainers.

## Useful Links

- Next.js Documentation (https://nextjs.org/docs/)
- Express.js Documentation (https://expressjs.com/en/)
- PNPM Documentation (https://pnpm.io/)

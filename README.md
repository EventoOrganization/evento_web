# Evento-Web Frontend Next.js Project

## Introduction

Welcome to the Evento Next.js project. This project aims to transition the existing Swift-based frontend to a Next.js-based Progressive Web Application (PWA). The backend remains in Express.js.

## Project Structure

- **frontend**: Contains the Next.js application.

## Prerequisites

- Node.js version 14.x or higher
- PNPM

## Setup Instructions

1. Clone the repository.
   ```bash
   git clone https://github.com/EventoOrganization/evento_web
   ```
1. Navigate to the project directory.
   ```bash
   cd evento-web
   ```
1. Install dependencies.

   ```bash
   pnpm install
   ```

1. Start the frontend server.

   ```bash
   cd /path/to/your/projects/evento-next
   pnpm run dev

   ```

## Project Goals

- Transition from Swift to Next.js.
- Maintain existing backend in Express.js.
- Implement PWA features.

## Key Features

- User authentication and management.
- Event creation and management.
- Real-time notifications.
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

# Udhaari Finance Application

## Overview

Udhaari is a comprehensive personal and shared finance tracking application designed to streamline expense management. Built with a focus on simplicity, readability, and performance, the application allows users to monitor their personal expenditures while effectively managing shared expenses within groups. The interface leverages an extremely minimalistic, high-contrast design system optimized for clarity and reduced cognitive load.

## Core Features

- Intuitive Dashboard: Provides an immediate overview of your true net outgoings. It incorporates dynamic calculations to combine private spending and group shares.
- Deep Split Analysis: A dedicated visualization component tracks what percentage of your outgoing cash flow is distributed between personal costs versus shared accounts.
- Personal Spending Log: An itemized tracking system where users can capture custom transactions, tag them with predefined categories, and review historical spending patterns.
- Collaborative Shared Accounts: Users can initialize group trips or household living arrangements. The engine robustly handles the real-time calculated balances, denoting who owes what dynamically.
- Authentication: Secure registration and login flows restricting access exclusively to verified account holders.

## Technical Architecture

The architecture relies entirely on a modern React ecosystem. 
- Build Tooling: Vite handles hot module replacement and ensures a lightweight, highly optimized production build sequence.
- State Management: Context API orchestrates the user authentication context and application state globally without heavy external libraries.
- Routing: React Router DOM maintains protected layout wrappers, preventing unauthenticated access to the main application loops.
- Styling: Tailwind CSS powers the utility-first methodology, enabling a stringent minimalist aesthetic with minimal compilation artifacts.
- Components & Visualization: Framer Motion provides non-intrusive layout animations, and Recharts parses data arrays into actionable visual split analyses.

## Directory Structure

- `src/components/`: Reusable interface components and layout shells like the global Sidebar navigation.
- `src/contexts/`: React context providers, primarily the central Authentication Context governing session state.
- `src/pages/`: The primary views routed to by the application (Dashboard, Expenses, Groups, Login).
- `src/utils/`: Computation utilities containing the `engine.js` responsible for securely processing expense sums and calculating complex balance differences.
- `src/hooks/`: Any dynamically imported native React hooks.

## Installation and Setup

1. Clone the repository to your local environment.
2. Ensure you have Node.js and a package manager (npm or yarn) installed.
3. Install dependencies by running `npm install`.
4. Run the local development server by executing `npm run dev`.
5. Access the application on the local port defined by Vite (typically localhost:5173).

## Contribution Guidelines

Contributions must strictly follow the minimalist aesthetic established in the frontend code. Components should not contain heavy background gradients or aggressive shadows. 

1. Ensure all code modifications pass local build checks.
2. Adhere to the pre-configured ESLint rules without bypassing strict checks.
3. Write clean, self-documenting code with meaningful parameter names rather than relying heavily on block comments.

## License

This application is provided under proprietary restrictions unless explicitly open-sourced by the original author.

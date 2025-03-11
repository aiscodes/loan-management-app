# Loan Management App

This is a loan management application built with **Next.js**, **Prisma**, and **PostgreSQL**. The application provides functionalities to manage loans, including creating, fetching, updating, and deleting loan records. It also supports user-specific loan management, including tracking loan status and deletion timestamps.

## Features

- **Loan Management**: Create, update, view, and delete loans.
- **Prisma ORM**: Interacts with PostgreSQL database using Prisma.
- **CRUD Operations**: Full Create, Read, Update, Delete capabilities for loan records.
- **Loan Validation**: Input validation when creating or updating loans.
- **Loan Status Tracking**: Track the status of loans (e.g., `Pending`, `Approved`, `Rejected`).
- **Soft Deletion**: Loans are not physically deleted; instead, a `deletedAt` timestamp is added to mark deleted records.

## Tech Stack

- **Frontend**: React (Next.js)
- **Backend**: Node.js with Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React's `useState` and `useEffect`
- **Styling**: Tailwind CSS
- **Logging**: Custom logging for error tracking and debugging
- **Environment Variables**: Managed via `.env` file

## Requirements

Ensure you have the following installed:

- **Node.js** (version >= 16.x)
- **PostgreSQL** (version >= 12.x)
- **Prisma ORM** (handled via dependencies)

## Installation and Setup

Follow the steps below to set up and run the project locally:

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
cd loan-management-app
```

### 2. Install Dependencies

Make sure you have **Node.js** installed. Then, install the project dependencies by running:

```bash
make install
```

This command will install all necessary dependencies via npm.

### 3. Set Up Database

Make sure you have PostgreSQL set up locally or remotely, and update the DATABASE_URL and SHADOW_DATABASE_URL in your .env file with the correct credentials.

### Example .env:

1. DATABASE_URL="postgresql://user:password@localhost:5432/loan_app_db"
2. SHADOW_DATABASE_URL="postgresql://user:password@localhost:5432/loan_app_db_shadow"

### 4. Run Migrations

After setting up your environment variables, generate the Prisma Client and run the initial migrations:

```bash
make migrations
```

This command will create the database tables based on your Prisma schema.

### 5. Build the Project

To build the project for production, run:

```bash
make build
```

### 6. Start the Development Server

To start the project in development mode, run:

```bash
make start
```

This will run the development server at http://localhost:3000.

### Makefile

The project includes a Makefile to automate common tasks. Here are the available commands:

1. install: Install project dependencies.
2. migrations: Generate Prisma Client and run migrations.
3. build: Build the project for production.
4. start: Run the project in development mode.
5. help: Display the help message with available targets.
   To get a list of available commands, you can simply run:

```bash
make help
```

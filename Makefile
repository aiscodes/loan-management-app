# Install dependencies
install: ## Install project dependencies
	npm install

# Migrations
migrations: ## Generate Prisma Client and run migrations
	npx prisma migrate dev --name init

# Build the project
build: ## Build the project for production
	npm run build

# Start the project
start: ## Run the project in development mode
	npm run dev

# Help
help: ## Display this help message
	@echo "Available targets:"
	@awk -F '##' '/^[a-z_]+:[a-z ]+##/ { print "\033[34m"$$1"\033[0m" "\n" $$2 }' Makefile

# Default goal
.DEFAULT_GOAL := help  # Default goal when no target is specified (shows the help message)

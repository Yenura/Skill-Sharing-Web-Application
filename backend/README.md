# PAF Backend

This is the Spring Boot backend for the Skill Sharing Web Application.

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven
- MongoDB

### Configuration
1. Copy `env.properties.example` to `env.properties` and fill in your own values.
2. For OAuth2 authentication, create developer apps on GitHub and Google to get client IDs and secrets.
3. Make sure MongoDB is running on your machine or update the connection string in your configuration.

### Running the Application
```bash
# Using Maven Wrapper
./mvnw spring-boot:run

# Or using Maven
mvn spring-boot:run
```

## Project Structure Cleanup
If you notice issues with duplicate directories (service/services, model/models, etc.), run the cleanup script:

```bash
# On Windows
.\cleanup.ps1

# On Unix/Mac
# chmod +x cleanup.sh
# ./cleanup.sh
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Search
- `GET /api/search?q={query}` - Search across all content
- `GET /api/search/fuzzy?q={query}&type={type}` - Fuzzy search
- `POST /api/search/weighted` - Weighted field search
- `GET /api/search/faceted` - Faceted search

## Common Issues and Fixes

### Duplicate Service/Repository Classes
The project had both singular and plural directories (service/services, model/models, etc.). 
We've created a cleanup script to consolidate these directories.

### Application Properties Conflict
There were both `application.properties` and `application.yml` files with overlapping configurations.
The cleanup script renames `application.properties` to a backup file, letting `application.yml` take precedence.

### Exposed Credentials
OAuth2 client IDs and secrets were hardcoded in the configuration files. These have been replaced with environment variables. 
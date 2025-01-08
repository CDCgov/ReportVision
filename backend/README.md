# Backend Middleware - Spring Boot Application

This document provides a guide for the **Backend Middleware** of the ReportVision project. This middleware bridges the **frontend React app** with the **OCR backend** 

---

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Testing](#testing)
4. [Project Architecture](#project-architecture)
5. [Key Features](#key-features)
6. [API Endpoints](#api-endpoints)
7. [Troubleshooting](#troubleshooting)


## Introduction

The backend of ReportVision is a **Spring Boot** application designed to:
- Serve as middleware connecting the frontend with OCR.
- Manage template storage
- Act as a middle layer to pass data for OCR extraction


### Installation

## To Run the Project please ensure you have docker set up
1. Clone the repository:
   ```bash
   git clone https://github.com/CDCgov/ReportVision.git
   cd ReportVision/backend
2. Run the app
Make sure you are in root

```shell
docker-compose -f backend.yaml up --build
```

3. Verify the app is running by visiting http://localhost:8080/api/health
 
# Testing

You can run gradle tests by bash into container

```shell
docker ps
```
Get the container id

```shell
docker exec -it <CONTAINER_ID> /bin/bash
```

```shell
./gradlew test
```

## Project Architecture

The backend is organized into the following key directories and files:

- **`src/main/java/gov/cdc/reportvision/`**:
  - **`controllers/`**: handle API requests from the frontend.
  - **`services/`**: service layer for managing templates, data extraction, and interactions with the OCR backend.
  - **`models/`**: Data models representing application entities
  - **`repositories/`**: Interfaces for database operations, 
  - **`config/`**: Configuration files for security, database connections, and CORS policies.
  - **`utils/`**: Utility classes for tasks like validation, logging, and file manipulation.
- **`src/test/`**: Includes unit and integration tests for the backend.
- **`Dockerfile`**: Docker configuration file for containerizing the application.

- **`README.md`**: Documentation for the backend application. 


## Key Features

#### Template Management
- **Upload, retrieve, and delete templates**:
  - Allows users to upload new templates for document segmentation.
  - Retrieve a list of all saved templates.
  - Delete templates by their unique ID.

#### Data Extraction
- **Document Processing**:
  - Connects to the OCR backend to process documents using predefined templates.
  - Extracts data based on segmented areas defined in the templates.
  - Returns structured extracted data.

#### Validation and Error Handling
- **Data Integrity Checks**:
  - Validates user inputs and template configurations.
  - Provides error messages for invalid requests or processing failures.

#### Secure Integration
- **Authentication**:
  - Implements JWT based authentication.
  - Configurable CORS policies to control frontend and third-party access.


## API Endpoints

The backend middleware exposes the following RESTful API endpoints:

#### Health Check
- **`GET /api/health`**
  - **Description**: Returns the status of the backend server.
  - **Response**: A  status message indicating the server's health.

#### Template Management
- **`POST /api/templates`**
  - **Description**: Upload a new template for document segmentation.
  - **Request Body**: JSON containing template details.
  - **Response**: Confirmation of the uploaded template.

- **`GET /api/templates`**
  - **Description**: Retrieve a list of all available templates.
  - **Response**: JSON array of template metadata.

- **`DELETE /api/templates/{id}`**
  - **Description**: Delete a specific template by its unique ID.
  - **Response**: Confirmation of deletion.

#### Data Extraction
- **`POST /api/extract`**
  - **Description**: Process a document using a selected template and return extracted data from OCR.
  - **Request Body**: JSON containing the document and selected template ID.
  - **Response**: JSON object with extracted data.

#### Configuration Management
- **`GET /api/config`**
  - **Description**: Retrieve the current configuration settings of the application.
  - **Response**: JSON object with configuration details.


## Troubleshooting

### Common Issues

#### Database Connection Fails
- **Cause**: The backend is unable to connect to the database.
- **Solution**:
  - Ensure the database server is running.
  - Verify that the `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` environment variables are correctly configured.

#### CORS Errors
- **Cause**: Frontend requests are being blocked due to Cross-Origin Resource Sharing (CORS) policies.
- **Solution**:
  - Update the `CorsConfig` class in the `config/` directory.
  - Add the necessary origins to the allowed list.

#### OCR Service Not Responding
- **Cause**: The backend is unable to communicate with the OCR service.
- **Solution**:
  - Verify that the `OCR_SERVICE_URL` is correctly set

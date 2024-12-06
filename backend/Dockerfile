# Use a Gradle base image
FROM gradle:latest AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the project files into the container
COPY . .

# Build the project
RUN gradle build

# Use a smaller base image for the final image
FROM openjdk:latest

# Set the working directory in the final image
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the port your application listens on (if applicable)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
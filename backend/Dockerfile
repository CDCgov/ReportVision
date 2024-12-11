# Use a base image with Java and Gradle
FROM openjdk:17-slim

# Set the working directory
WORKDIR /app

# Copy the project files
COPY . .

RUN chmod +x ./gradlew

EXPOSE 8081

ENTRYPOINT [ "./gradlew", "bootRun", "--continuous", "--args=--server.port=8081" ]
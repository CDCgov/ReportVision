# Use a base image with Java and Gradle
FROM openjdk:17-slim

# Set the working directory
WORKDIR /app

# Copy the project files
COPY . .

RUN chmod +x ./gradlew

EXPOSE 8080

ENTRYPOINT [ "./gradlew", "bootRun" ]
# Stage 1: Build the application
FROM gradle:7-jdk11 AS build
WORKDIR /app

# Copy the Gradle wrapper and project files
COPY gradlew /app/gradlew
COPY gradle/wrapper /app/gradle/wrapper
COPY build.gradle.kts /app/build.gradle
COPY settings.gradle.kts /app/settings.gradle
COPY src /app/src

# Make the Gradle wrapper executable
RUN chmod +x gradlew
CMD ["./gradlew", "build"]


COPY /app/build/libs/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
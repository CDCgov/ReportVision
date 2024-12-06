# Stage 1: Build the application
FROM gradle:7-jdk11 AS build
WORKDIR /app
COPY . .
RUN ./gradlew build

# Stage 2: Create the runtime image
FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
# Stage 1: Build the application
FROM gradle:7-jdk11 AS build
WORKDIR /app
COPY . .
CMD ["./gradlew", "build"]


COPY ./build/libs/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
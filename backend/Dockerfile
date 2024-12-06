FROM eclipse-temurin:17.0.8_7-jdk as build

WORKDIR /app/

ADD ./backend /app/backend
ADD .git /app/.git

# compile backend into a jar
RUN cd backend && ./gradlew clean build -x test -x checkstyleMain -x spotlessCheck

FROM eclipse-temurin:17.0.8_7-jre

COPY --from=build /app/backend/build/libs/*.jar app.jar

ENTRYPOINT ["java","-jar","/app.jar"]

EXPOSE 8081
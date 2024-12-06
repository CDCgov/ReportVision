FROM eclipse-temurin:17.0.8_7-jdk as build

WORKDIR /app/

ADD . /app/backend

# compile backend into a jar
RUN gradle --no-daemon assemble

FROM eclipse-temurin:17.0.8_7-jre

COPY --from=build /app/backend/build/libs/*.jar app.jar

ENTRYPOINT ["java","-jar","/app.jar"]

EXPOSE 8081
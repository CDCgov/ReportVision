FROM openjdk:11-jre-slim as build
WORKDIR /app/
ARG JAR_FILE
ADD ./backend /app/backend

FROM openjdk:11-jre-slim
ARG JAR_FILE
COPY --from=build ${JAR_FILE} app.jar

EXPOSE 8081
ENTRYPOINT ["java","-jar","/app.jar"]
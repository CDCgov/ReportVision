FROM amazoncorretto:17

WORKDIR /app/

COPY . .

RUN chmod +x ./gradlew

ENTRYPOINT [ "./gradlew", "bootRun", "--continuous", "--args=--server.port=8081" ]
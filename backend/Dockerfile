FROM amazoncorretto:17
ENV HOME=/app
RUN mkdir -p $HOME
WORKDIR $HOME

ENTRYPOINT ["./gradlew", "bootRun", "--continuous", "--args='--server.port=8081'"]
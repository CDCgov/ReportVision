FROM openjdk:11-jre-slim
ENV HOME=/app
RUN mkdir -p $HOME
WORKDIR $HOME
CMD [ "chmod", "+x", "./gradlew"  ]
EXPOSE 8081

ENTRYPOINT [ "./gradlew", "bootRun", "--continuous", "--args=--server.port=8081" ]
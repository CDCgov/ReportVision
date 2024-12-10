FROM openjdk:11-jre-slim
ENV HOME=/app
RUN mkdir -p $HOME
WORKDIR $HOME

ARG JAR_FILE
COPY ${JAR_FILE} app.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","/app.jar"]
# Dockerfile for Spring Boot Application
FROM openjdk:17-jdk
#VOLUME /tmp
WORKDIR /app
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} webgis.jar
EXPOSE 8083, 8080
ENTRYPOINT ["java","-jar","/webgis.jar"]

# Dockerfile for Spring Boot Application
FROM openjdk:17-jdk
VOLUME /tmp
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} webgis.jar
ENTRYPOINT ["java","-jar","/webgis.jar"]

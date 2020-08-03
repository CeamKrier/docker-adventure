FROM alpine
WORKDIR /usr/app
RUN apk add --update redis
CMD ["redis-server","--protected-mode", "no"]
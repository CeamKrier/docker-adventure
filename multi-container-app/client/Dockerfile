FROM node:alpine as builder
WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx
# Defining the port to expose
EXPOSE 3000 
# Copying the required config file
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# Finally, copying the build file to the folder that we defined in local nginx's root directory
COPY --from=builder /usr/app/build /usr/share/nginx/html
# Build react app
FROM node:alpine as build
WORKDIR '/usr/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Serve generated build of react with nginx
FROM nginx
# Exposes port 80 to outer world. Added that to successfully deploy to AWS
EXPOSE 80
# Copies the built react resources to the nginx's default share location
COPY --from=build /usr/app/build /usr/share/nginx/html
# nginx does not need to get started to run
# If it has files in its default location than will serve them automatically
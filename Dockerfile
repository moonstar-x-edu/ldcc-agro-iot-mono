# Webapp Builder
FROM node:16.6.1-alpine3.14 AS web-builder

# Build Env (Need to add them from the webapp/.env file)
# ARG var
# ENV VAR=$var

WORKDIR /opt/webapp
COPY webapp/package*.json ./
RUN npm ci
COPY webapp/ ./
RUN npm run build

# Image
FROM node:16.6.1-alpine3.14

# Webapp
WORKDIR /opt/webapp
COPY --from=web-builder /opt/webapp/build .

# Backend
WORKDIR /opt/backend
COPY backend/package*.json ./
RUN npm ci --only=prod
COPY backend/ ./

ENV WEBAPP_DIR="/opt/app/webapp"

CMD ["npm", "start"]

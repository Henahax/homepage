FROM node:22
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
RUN rm -rf src/ static/ emailTemplates/ docker-compose.yml
USER node:node
CMD ["node","build/index.js"]
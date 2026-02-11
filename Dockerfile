FROM node:20-alpine

WORKDIR /app

# Copy package files first (better cache)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the rest of the project
COPY . .

EXPOSE 7291

CMD ["node", "index.js"]

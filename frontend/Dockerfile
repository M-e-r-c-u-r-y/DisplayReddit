# To directly build and expose port 5000 of the built React app
# FROM node:12-alpine
# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app
# COPY package.json .
# RUN npm install
# COPY . .
# RUN npm run build

# FROM node:12-alpine
# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app
# COPY --from=0 /usr/src/app/build ./build
# RUN npm install -g serve
# EXPOSE 5000
# CMD ["serve", "-s", "build"]

# # Use docker run -p 5050:5000 reactimage:latest to start the app
# # http://localhost:5050 is where you can view the build react app

# # To run in development mode and expose port 3000 of the React app
FROM node:12-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@3.4.3 -g
COPY . ./
# EXPOSE 3000
# CMD ["npm", "start"]

# # Use docker run -it -d -p 5050:3000 reactimage:latest to start the app
# # http://localhost:5050 is where you can view the build react app

# FROM python:3.8
# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app
# ENV MAX_ROWS=5
# ENV OUTPUT_PATH="../output/"
# COPY requirements.txt requirements.txt
# RUN pip3 install -r requirements.txt
# COPY *.py ./
# EXPOSE 8000
# CMD ["uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"]
# CMD ["uvicorn", "main:app" "--reload"]
# docker run -it -p 8000:8000 -v $(pwd)/../output:/usr/src/app/../output reactimage:latest

# docker run -it -d -p 5050:3000 -p 8000:8000 -v $(pwd)/../output:/usr/src/app/../output reactimage:latest
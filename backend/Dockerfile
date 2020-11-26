FROM python:3.8-slim as base
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# ENV MAX_ROWS
# ENV OUTPUT_PATH
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt
COPY ./app ./app
FROM base AS dev
CMD ["uvicorn", "app.main:app", "--reload", "--workers", "1", "--host", "0.0.0.0", "--port", "8000"]
# EXPOSE 8000
# CMD ["uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"]
# CMD ["uvicorn", "main:app" "--reload"]
# docker run -it -p 8000:8000 -v $(pwd)/../output:/usr/src/app/output reactimage:latest

# docker run -it -d -p 5050:3000 -p 8000:8000 -v $(pwd)/../output:/usr/src/app/../output reactimage:latest
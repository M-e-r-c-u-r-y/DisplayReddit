from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from datetime import datetime, timedelta
import pandas as pd
import glob
import utils
import os
from rejson import Client, Path
from redis.exceptions import WatchError

app = FastAPI()
cache = Client(host='redis', port=6379, decode_responses=True)
pipe = cache.pipeline()

app.add_middleware(CORSMiddleware, allow_origins=["*"])

# Get the data from environment variables
MAX_ROWS = int(os.environ.get("MAX_ROWS", "5"))
OUTPUT_PATH = os.environ.get("OUTPUT_PATH", "Not Set")
CACHE_MINUTES = int(os.environ.get("CACHE_MINUTES", 15))

# Check if api's working
@app.get("/")
def read_root():
    return {"API": "Working"}

# Get's info on the cache
@app.get("/cache")
def read_cached_keys():
    data = {"memory_stats": cache.memory_stats(),
            "cache": cache.keys(),
           }
    if len(cache.keys()) > 0:
        data["random key's ttl"] = cache.ttl(cache.randomkey())
    return data

# Clears all the data in cache
# Ideally should be run in a separate container and network/ separate endpoint than the main service
@app.get("/clearcache")
def clear_cached_keys():
    cache.flushdb()
    return {"cache": cache.keys()}

#Fetch data
@app.get("/data/{fetch_type}/{fetch_category}/{file_time}")
def read_full_data(
    fetch_type: str,
    fetch_category: str,
    file_time: str,
    nrows: str = "5",
    skiprows: str = "None",
):
    url_path = f"/data/{fetch_type}/{fetch_category}/{file_time}/{nrows}/{skiprows}"
    if cache.exists(url_path):
        return cache.jsonget(url_path, Path.rootPath())
    valid_fetch_types = ["submissions", "comments"]
    valid_fetch_category = ["hot", "new"]
    if fetch_type in valid_fetch_types and fetch_category in valid_fetch_category:
        if nrows == "all":
            nrows = MAX_ROWS
        else:
            try:
                nrows = int(nrows)
                if nrows < 1:
                    return {"error": {"nrows": "Must be an integer > 0"}}
            except ValueError:
                return {"error": {"nrows": "Must be an integer > 0 or all"}}
        if skiprows == "None":
            skiprows = None
        else:
            try:
                skiprows = int(skiprows)
                if skiprows < 1:
                    return {"error": {"skiprows": "Must be an integer > 0"}}
                skiprows = range(1, skiprows + 1)
            except ValueError:
                return {"error": {"skiprows": "Must be an integer > 0 or None"}}
        submissions_file_name = "_".join([fetch_type, fetch_category, file_time])
        submissions_file_name = OUTPUT_PATH + submissions_file_name + ".csv"
        try:
            data = pd.read_csv(
                submissions_file_name,
                skiprows=skiprows,
                nrows=nrows,
                keep_default_na=False,
            )
            if fetch_type == "submissions":
                data["selftext"] = data["selftext"].apply(utils.cleanse_text)
            if fetch_type == "comments":
                data["body"] = data["body"].apply(utils.cleanse_text)

            data = data.to_dict("records")
            try:
                pipe.watch(url_path)
                pipe.multi()
                pipe.jsonset(url_path, Path.rootPath(), data)
                pipe.expire(url_path, timedelta(minutes=CACHE_MINUTES))
                pipe.execute()
            except WatchError:
                pass
            finally:
                pipe.reset()
            return data
        except FileNotFoundError:
            return {"error": {"detail": "Page Not Found"}}
        else:
            return {"error": {"detail": "Server Down"}}
    else:
        return {"error": {"detail": "No access"}}

# Return all valid paths
@app.get("/display")
def read_valid_paths():
    if cache.exists('/display'):
        return cache.jsonget('/display', Path.rootPath())
    pattern = f"%d-%m-%Y-%H-%M-%S"
    files_to_fetch = "*.csv"
    if OUTPUT_PATH == "Not Set":
        return {"error": {"detail": "Data not found on server"}}
    files = glob.glob(OUTPUT_PATH + files_to_fetch)
    files = [el.split(OUTPUT_PATH)[1].split(".csv")[0] for el in files]
    paths = ["data/" + "/".join(el.split("_")) for el in files]
    times = [datetime.strptime(el.split("_")[-1], pattern).isoformat() for el in files]
    types = [el.split("_")[0] for el in files]
    category = [el.split("_")[1] for el in files]

    template = {
        "path": paths,
        "time": times,
        "type": types,
        "category": category,
    }

    data = pd.DataFrame(data=template).to_dict("records")
    try:
        pipe.watch('/display')
        pipe.multi()
        pipe.jsonset('/display', Path.rootPath(), data)
        pipe.expire("/display", timedelta(minutes=CACHE_MINUTES))
        pipe.execute()
    except WatchError:
        pass
    finally:
        pipe.reset()
    return data

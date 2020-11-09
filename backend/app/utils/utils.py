import os
from rejson import Client, Path
from redis.exceptions import WatchError
from datetime import timedelta

from ..models.models import QueryParams
from typing import Optional
from fastapi import Query

MAX_ROWS = int(os.environ.get("MAX_ROWS", "5"))
CACHE_MINUTES = int(os.environ.get("CACHE_MINUTES", 15))
cache = Client(host="redis", port=6379, decode_responses=True)
pipe = cache.pipeline()

# Separate function to add data into cache in the background
def add_to_cache(url_path: str, data):
    try:
        pipe.watch(url_path)
        pipe.multi()
        pipe.jsonset(url_path, Path.rootPath(), data)
        pipe.expire(url_path, timedelta(minutes=CACHE_MINUTES))
        pipe.execute()
    except WatchError:
        print("Watch error")
    finally:
        pipe.reset()
    return


# Separate function to fetch data from cache
def get_from_cache(url_path: str):
    return cache.jsonget(url_path, Path.rootPath())


def get_cache_info():
    data = {
        "memory_stats": cache.memory_stats(),
        # "keys": cache.keys(),  # Use only in development, not in production
        "len": cache.dbsize(),
        # "info": cache.info(),
    }
    if data["len"] > 0:
        data["random key's ttl"] = cache.ttl(cache.randomkey())
    return data


def clear_cache():
    cache.flushdb()
    return {
        "memory_stats": cache.memory_stats(),
        "len": cache.dbsize(),
    }


options = [
    {
        "name": "Tone",
        "values": ["Positive", "Negative", "Neutral"],
        "optionType": "radiobutton",
    },
    {
        "name": "Type",
        "values": ["Question", "Answer", "General Discussion"],
        "optionType": "radiobutton",
    },
    {
        "name": "Language",
        "values": ["English", "Spanish", "Both", "Neither"],
        "optionType": "radiobutton",
    },
]


async def common_parameters(
    nrows: Optional[int] = Query(5, ge=0, le=MAX_ROWS),
    skiprows: Optional[int] = Query(0, ge=0),
):
    return QueryParams(**{"nrows": nrows, "skiprows": skiprows})

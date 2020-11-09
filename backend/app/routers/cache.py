from ..utils.utils import get_cache_info, clear_cache
from fastapi import APIRouter

router = APIRouter()


@router.get("/cache")
def cache_info():
    """
    # To get info on the cache
    """
    return get_cache_info()


# Ideally should be run in a separate container and network/ separate endpoint than the main service
@router.get("/clearcache")
def clear_cached_keys():
    """
    # To clear the cache
    """
    return clear_cache()

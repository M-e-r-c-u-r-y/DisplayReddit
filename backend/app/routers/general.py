from fastapi import APIRouter, BackgroundTasks
from typing import List, Dict
from tortoise.queryset import QuerySet

from ..models.models import (
    CommentsList_Pydantic,
    PostsList_Pydantic,
    Comments,
    Posts,
    Request_Results,
    Result_Pydantic,
    ResultIn_Pydantic,
    Results,
)

from ..utils.utils import (
    add_to_cache,
    get_from_cache,
    common_parameters,
    options,
)

router = APIRouter()

# Return all valid paths
@router.get(
    "/api/v2/display",
    response_model=List,
)
async def read_valid_paths(background_tasks: BackgroundTasks):
    """
    # To get info on all valid paths for posts and comments ordered by fetched utc
    """
    data = get_from_cache("/api/v2/display")
    if data is not None:
        return data
    posts = await PostsList_Pydantic.from_queryset(
        QuerySet(Posts).only("fetched_utc").distinct()
    )
    comments = await CommentsList_Pydantic.from_queryset(
        QuerySet(Comments).only("fetched_utc").distinct()
    )
    data = posts.dict()["__root__"]
    data.extend(comments.dict()["__root__"])
    data.sort(key=lambda item: item["fetched_utc"], reverse=True)
    for item in data:
        item.update({"fetched_utc": item["fetched_utc"].isoformat()})
    background_tasks.add_task(add_to_cache, url_path="/api/v2/display", data=data)
    return data


# Return all valid paths
@router.post(
    "/api/v1/tagged/",
    response_model=Dict,
)
async def tagged_data(items: List[Request_Results]):
    """
    # To get tagged data
    """
    normalized = []
    for item in items:
        for dataitem in item.data:
            normalized.append(
                {
                    "id": item.id,
                    "table_name": item.datatype,
                    "field_value": dataitem.value,
                    "field_name": dataitem.name,
                }
            )
    normalized_result = map(lambda item: Results(**item), normalized)
    output = await Results.bulk_create(normalized_result)
    print(output)
    return {"success": True}
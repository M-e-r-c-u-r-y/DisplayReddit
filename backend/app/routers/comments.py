from fastapi import APIRouter, BackgroundTasks, Path, Depends
from ..models.models import (
    Comments,
    DateUrl,
    Tagger,
    QueryParams,
)

from tortoise.queryset import QuerySet

from ..utils.utils import add_to_cache, get_from_cache, common_parameters, options

router = APIRouter()


@router.get(
    "/api/v1/data/comments/{dt}",
    response_model=Tagger,
)
async def get_comments_from_unix_epoch(
    background_tasks: BackgroundTasks,
    dt: int = Path(
        ...,
        description="The unix epoch of the comment to get",
    ),
    query_params: QueryParams = Depends(common_parameters),
):
    """
    # To get comments for a particular unix epoch
    """
    url_path = f"/api/v1/data/comments/{dt}?nrows={query_params.nrows}&skiprows={query_params.skiprows}"
    data = get_from_cache(url_path)
    if data is not None:
        return data
    dt_Pydantic = DateUrl(**{"dt": dt})
    data = (
        await QuerySet(Comments)
        .filter(fetched_utc=dt_Pydantic.dt_utc)
        .limit(query_params.nrows)
        .offset(query_params.skiprows)
        .order_by("id")
        .values("id", "author", "score", "body", "permalink")
    )
    # print(type(data), data[0], type(data[0]))
    # print(Comments_Display.schema_json(indent=2))
    # print(type(Comments_Display))
    # print(type(CommentsTagger))
    # print(Post_Pydantic.schema_json(indent=2))
    # print(PostIn_Pydantic.schema_json(indent=2))
    output = {
        "data": data,
        "options": options,
        "data_len": len(data),
        "options_len": len(options),
    }
    background_tasks.add_task(add_to_cache, url_path=url_path, data=output)
    return output
from fastapi import APIRouter, BackgroundTasks, Path, Depends, HTTPException

from typing import List

from ..models.models import (
    Posts,
    Post_Pydantic,
    PostIn_Pydantic,
    DateUrl,
    QueryParams,
    Status,
    Tagger,
)

from tortoise.queryset import QuerySet
from tortoise.contrib.fastapi import HTTPNotFoundError

from ..utils.utils import add_to_cache, get_from_cache, common_parameters, options


router = APIRouter()


@router.get("/api/v1/data/posts/{dt}", response_model=Tagger)
async def get_posts_from_unix_epoch(
    background_tasks: BackgroundTasks,
    dt: int = Path(
        ...,
        description="The unix epoch of the posts to get",
    ),
    query_params: QueryParams = Depends(common_parameters),
):
    """
    # To get posts for a particular date
    """
    url_path = f"/api/v1/data/posts/{dt}?nrows={query_params.nrows}&skiprows={query_params.skiprows}"
    data = get_from_cache(url_path)
    if data is not None:
        return data
    dt_Pydantic = DateUrl(**{"dt": dt})
    data = (
        await QuerySet(Posts)
        .filter(fetched_utc=dt_Pydantic.dt_utc)
        .limit(query_params.nrows)
        .offset(query_params.skiprows)
        .order_by("id")
        .values("id", "author", "score", "selftext", "title", "permalink")
    )
    finaldata = {
        "data": data,
        "options": options,
        "data_len": len(data),
        "options_len": len(options),
    }
    background_tasks.add_task(add_to_cache, url_path=url_path, data=finaldata)
    return finaldata


# Testing CRUD operations using tortoise orm and fastapi

# @router.get("/posts", response_model=List[Post_Pydantic])
# async def get_posts():
#     """
#     # To get first five posts ordered by ID
#     """
#     return await Post_Pydantic.from_queryset(Posts.all().limit(5).order_by("-id"))


# @router.post("/posts", response_model=Post_Pydantic)
# async def create_post(post: PostIn_Pydantic):
#     """
#     # To create a new post
#     """
#     post_obj = await Posts.create(**post.dict(exclude_unset=True))
#     return await Post_Pydantic.from_tortoise_orm(post_obj)


# @router.get(
#     "/post/{post_id}",
#     response_model=Post_Pydantic,
#     responses={404: {"model": HTTPNotFoundError}},
# )
# async def get_post(post_id: int):
#     """
#     # To get a post given its ID
#     """
#     return await Post_Pydantic.from_queryset_single(Posts.get(id=post_id))


# @router.post(
#     "/post/{post_id}",
#     response_model=Post_Pydantic,
#     responses={404: {"model": HTTPNotFoundError}},
# )
# async def update_post(post_id: int, post: PostIn_Pydantic):
#     """
#     # To update a post for a given ID
#     """
#     await Posts.filter(id=post_id).update(**post.dict(exclude_unset=True))
#     return await Post_Pydantic.from_queryset_single(Posts.get(id=post_id))


# @router.delete(
#     "/post/{post_id}",
#     response_model=Status,
#     responses={404: {"model": HTTPNotFoundError}},
# )
# async def delete_post(post_id: int):
#     """
#     # To delete a post given its ID
#     """
#     deleted_count = await Posts.filter(id=post_id).delete()
#     if not deleted_count:
#         raise HTTPException(status_code=404, detail=f"Post {post_id} not found")
#     return Status(message=f"Deleted post {post_id}")

# pylint: disable=E0611, E0213
# https://github.com/samuelcolvin/pydantic/issues/568
from tortoise import fields
from tortoise.models import Model
from tortoise.contrib.pydantic import pydantic_model_creator, pydantic_queryset_creator

from typing import Optional, List, Type, Union
from enum import Enum
from pydantic import BaseModel, ValidationError, validator

from datetime import datetime

from fastapi_users import models
from fastapi_users.db import TortoiseBaseUserModel

pattern = f"%d-%m-%Y-%H-%M-%S"


class Basedatamodel(Model):
    """
    The base data model for posts and comments
    """

    id = fields.IntField(pk=True)
    # url of the post
    permalink = fields.CharField(max_length=300)
    author = fields.CharField(max_length=50)
    score = fields.IntField()
    created_utc = fields.DatetimeField(auto_now_add=True)
    fetched_utc = fields.DatetimeField(auto_now=True)

    class Meta:
        abstract = True

    def fetched_utc_ts(self) -> int:
        return int(self.fetched_utc.timestamp())

    def datatype(self) -> str:
        pass

    def datapath(self) -> str:
        return f"data/{self.datatype()}/{self.fetched_utc_ts()}"

    # class PydanticMeta:
    #     computed = ["fetched_utc_ts", "datatype", "datapath"]


class Posts(Basedatamodel):
    """
    The Post model
    """

    selftext = fields.CharField(max_length=40000)
    title = fields.CharField(max_length=300)

    class Meta:
        table = "posts"

    def datatype(self) -> str:
        return "posts"


Post_Pydantic = pydantic_model_creator(Posts, name="Post")
PostIn_Pydantic = pydantic_model_creator(Posts, name="PostIn", exclude_readonly=True)
PostsList_Pydantic = pydantic_queryset_creator(
    Posts,
    name="Posts_List_Query",
    include=(tuple(["fetched_utc"])),
    computed=(tuple(["fetched_utc_ts", "datatype", "datapath"])),
)

Posts_Display = pydantic_model_creator(
    Posts,
    name="Posts_Display_Model",
    exclude=(tuple(["fetched_utc", "created_utc"])),
)


class Comments(Basedatamodel):
    """
    The Comments model
    """

    body = fields.CharField(max_length=10000)
    parent_id = fields.CharField(max_length=300)
    submission = fields.CharField(max_length=300)

    class Meta:
        table = "comments"

    def datatype(self) -> str:
        return "comments"


Comment_Pydantic = pydantic_model_creator(Comments, name="Comment")
CommentIn_Pydantic = pydantic_model_creator(
    Comments, name="CommentIn", exclude_readonly=True
)

CommentsList_Pydantic = pydantic_queryset_creator(
    Comments,
    name="Comments_List_Query",
    include=(tuple(["fetched_utc"])),
    computed=(tuple(["fetched_utc_ts", "datatype", "datapath"])),
)

Comments_Display = pydantic_model_creator(
    Comments,
    name="Comments_Display_Model",
    include=(tuple(["permalink", "author", "body", "id", "score"])),
)


class Status(BaseModel):
    message: str


class DateUrl(BaseModel):
    """
    The Date model
    """

    dt: int
    dt_utc: Optional[datetime] = None

    @validator("dt_utc", pre=True, always=True)
    def dt_utc_creator(cls, v, values, **kwargs):
        return datetime.fromtimestamp(values["dt"])


class Options(BaseModel):
    """
    The Options model
    """

    name: str
    optionType: str
    values: List[str]


class Tagger(BaseModel):
    """
    The Tagger model
    """

    data: List[Union[Comments_Display, Posts_Display]]
    options: List[Options]
    data_len: int
    options_len: int


class QueryParams(BaseModel):
    """
    The QueryParams model
    """

    nrows: int
    skiprows: int


class Results(Model):
    """
    The Results model
    """

    dataid = fields.IntField(pk=True)
    # url of the post
    id = fields.IntField()
    table_name = fields.CharField(max_length=50)
    field_name = fields.CharField(max_length=50)
    field_value = fields.CharField(max_length=50)

    class Meta:
        table = "results"


Result_Pydantic = pydantic_model_creator(Results, name="Results")
ResultIn_Pydantic = pydantic_model_creator(
    Results, name="ResultsIn", exclude_readonly=True
)


class Data(BaseModel):
    """
    The data model for the results
    """

    value: str
    name: str


class DataType(str, Enum):
    posts = "posts"
    comments = "comments"


class Request_Results(BaseModel):
    """
    The request results model
    """

    id: int
    datatype: DataType
    data: List[Data]

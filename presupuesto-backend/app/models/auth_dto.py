from pydantic import BaseModel
from typing import List

class AuthRequest(BaseModel):
    username: str
    password: str

class UserAD(BaseModel):
    sAMAccountName: str
    displayName: str
    groups: List[str]

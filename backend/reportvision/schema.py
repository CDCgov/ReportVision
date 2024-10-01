from pydantic import BaseModel
from datetime import datetime

class TemplateSchema(BaseModel):
    name: str
    description: str
    lab: str
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True
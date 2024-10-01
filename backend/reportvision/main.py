from fastapi import FastAPI, Depends

from sqlalchemy.orm import Session

from reportvision.database import s, engine  
from reportvision import crud, models, schema


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    try:
        db = s()
        yield db
    finally:
        db.close()

@app.get("/health")
async def health_check():
    return {"status": "UP"}

@app.get("/templates")
async def get_templates(db: Session = Depends(get_db)):
    templates = crud.get_templates(db)
    return templates 

@app.post("/templates")
async def create_template(template: schema.TemplateSchema, db: Session = Depends(get_db)):
    return crud.create_template(db, template)
    
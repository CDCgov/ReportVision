from sqlalchemy.orm import Session

from reportvision import crud, models, schema

def get_templates(db: Session):
    return db.query(models.Template).all()

def get_template(db: Session, id: int):
    return db.query(models.Template).filter(models.Template.id == id).first()

def create_template(db: Session, template: schema.TemplateSchema) -> models.Template:
    
    templateItem = models.Template(**template.dict())
    db.add(templateItem)
    db.commit()
    db.refresh(templateItem)
    return template

# def update_template(db: Session, template: TemplateSchema) -> Template:
#     db.add(template)
#     db.commit()
#     db.refresh(template)
#     return template

# def delete_template(db: Session, id: int) -> None:
#     template = db.query(Template).filter(Template.id == id).first()
#     db.delete(template)
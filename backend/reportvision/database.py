from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# TODO: Add database connection pooling
# TODO: Add environment variable for database URL
SQL_ALCHEMY_DATABASE_URL = "postgresql://postgres:super_secret_password@localhost:5432/reportvision"

engine = create_engine(SQL_ALCHEMY_DATABASE_URL) 

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
s = SessionLocal
Base = declarative_base()

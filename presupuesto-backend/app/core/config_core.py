from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    AD_DOMAIN: str
    AD_SERVER: str
    AD_BASE_DN: str

    DATABASE_HOST: str
    DATABASE_USER: str
    DATABASE_PASSWORD: str
    DATABASE_BI: str

    JWT_SECRET: str
    JWT_EXPIRE_MINUTES: int

    class Config:
        env_file = ".env"

settings = Settings()

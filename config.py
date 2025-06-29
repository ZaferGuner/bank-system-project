import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
DATABASE_URL = "sqlite:///./bank_system.db"
BCRYPT_ROUNDS = 12
MAX_LOGIN_ATTEMPTS = 3
ACCOUNT_LOCKOUT_DURATION = 1800 
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    phone: str
    address: Optional[str] = None

class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Şifre en az 8 karakter olmalıdır')
        if not any(c.isupper() for c in v):
            raise ValueError('Şifre en az bir büyük harf içermelidir')
        if not any(c.islower() for c in v):
            raise ValueError('Şifre en az bir küçük harf içermelidir')
        if not any(c.isdigit() for c in v):
            raise ValueError('Şifre en az bir rakam içermelidir')
        return v

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class AccountBase(BaseModel):
    account_type: str
    currency: str = "TRY"
    daily_limit: Decimal = Decimal("10000.00")

class AccountCreate(AccountBase):
    pass

class AccountResponse(AccountBase):
    id: int
    account_number: str
    balance: Decimal
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class TransactionBase(BaseModel):
    to_account_number: str
    amount: Decimal
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    @validator('amount')
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError('İşlem tutarı 0\'dan büyük olmalıdır')
        if v > 100000:
            raise ValueError('Maksimum işlem tutarı 100.000 TL\'dir')
        return v

class TransactionResponse(BaseModel):
    id: int
    transaction_id: str
    from_account_id: int
    to_account_id: int
    amount: Decimal
    transaction_type: str
    description: Optional[str]
    status: str
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class BalanceResponse(BaseModel):
    account_number: str
    balance: Decimal
    currency: str

class TransactionHistory(BaseModel):
    transactions: List[TransactionResponse]
    total_count: int
    page: int
    per_page: int 
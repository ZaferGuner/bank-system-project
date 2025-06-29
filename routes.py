from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import services
from database import get_db
from security import get_current_user, create_access_token

router = APIRouter()

@router.post("/auth/register", response_model=schemas.UserResponse)
def register_user(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    user_service = services.UserService(db)
    return user_service.create_user(user_data)

@router.post("/auth/login", response_model=schemas.Token)
def login_user(login_data: schemas.UserLogin, request: Request, db: Session = Depends(get_db)):
    user_service = services.UserService(db)
    audit_service = services.AuditService(db)
    
    user = user_service.authenticate_user(login_data.username, login_data.password)
    
    access_token = create_access_token(data={"sub": user.username})
    
    audit_service.log_action(
        user_id=user.id,
        action="login",
        details=f"Kullanıcı giriş yaptı",
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent")
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/user/profile", response_model=schemas.UserResponse)
def get_user_profile(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.get("/accounts", response_model=List[schemas.AccountResponse])
def get_user_accounts(current_user: models.User = Depends(get_current_user), 
                     db: Session = Depends(get_db)):
    account_service = services.AccountService(db)
    return account_service.get_user_accounts(current_user.id)

@router.post("/accounts", response_model=schemas.AccountResponse)
def create_account(account_data: schemas.AccountCreate,
                  current_user: models.User = Depends(get_current_user),
                  db: Session = Depends(get_db)):
    account_service = services.AccountService(db)
    audit_service = services.AuditService(db)
    
    account = account_service.create_account(current_user.id, account_data)
    
    audit_service.log_action(
        user_id=current_user.id,
        action="account_created",
        details=f"Yeni hesap oluşturuldu: {account.account_number}"
    )
    
    return account

@router.get("/accounts/{account_number}/balance", response_model=schemas.BalanceResponse)
def get_account_balance(account_number: str,
                       current_user: models.User = Depends(get_current_user),
                       db: Session = Depends(get_db)):
    account_service = services.AccountService(db)
    return account_service.get_balance(account_number, current_user.id)

@router.post("/accounts/{account_number}/transfer", response_model=schemas.TransactionResponse)
def transfer_money(account_number: str,
                  transaction_data: schemas.TransactionCreate,
                  request: Request,
                  current_user: models.User = Depends(get_current_user),
                  db: Session = Depends(get_db)):
    transaction_service = services.TransactionService(db)
    audit_service = services.AuditService(db)
    
    transaction = transaction_service.transfer_money(
        account_number, current_user.id, transaction_data
    )
    
    audit_service.log_action(
        user_id=current_user.id,
        action="money_transfer",
        details=f"Para transferi: {transaction_data.amount} TL - {account_number} -> {transaction_data.to_account_number}",
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent")
    )
    
    return transaction

@router.get("/accounts/{account_number}/transactions", response_model=schemas.TransactionHistory)
def get_transaction_history(account_number: str,
                           page: int = 1,
                           per_page: int = 20,
                           current_user: models.User = Depends(get_current_user),
                           db: Session = Depends(get_db)):
    if per_page > 100:
        per_page = 100
    
    transaction_service = services.TransactionService(db)
    return transaction_service.get_transaction_history(
        account_number, current_user.id, page, per_page
    )

@router.get("/health")
def health_check():
    return {"status": "healthy", "message": "Banka sistemi çalışıyor"} 
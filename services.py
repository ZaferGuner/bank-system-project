from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from decimal import Decimal
import models
import schemas
from security import hash_password, verify_password, generate_account_number, hash_sensitive_data
from config import MAX_LOGIN_ATTEMPTS, ACCOUNT_LOCKOUT_DURATION
import uuid

class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_user(self, user_data: schemas.UserCreate) -> models.User:
        existing_user = self.db.query(models.User).filter(
            or_(models.User.username == user_data.username, 
                models.User.email == user_data.email)
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Kullanıcı adı veya e-posta zaten kullanımda"
            )
        
        hashed_password = hash_password(user_data.password)
        
        db_user = models.User(
            username=user_data.username,
            email=user_data.email,
            password_hash=hashed_password,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            phone=user_data.phone,
            address=user_data.address
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        
        self.create_default_account(db_user.id)
        
        return db_user
    
    def authenticate_user(self, username: str, password: str) -> models.User:
        user = self.db.query(models.User).filter(models.User.username == username).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Geçersiz kullanıcı adı veya şifre"
            )
        
        if user.locked_until and user.locked_until > datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail="Hesap geçici olarak kilitlendi"
            )
        
        if not verify_password(password, user.password_hash):
            user.failed_login_attempts += 1
            
            if user.failed_login_attempts >= MAX_LOGIN_ATTEMPTS:
                user.locked_until = datetime.utcnow() + timedelta(seconds=ACCOUNT_LOCKOUT_DURATION)
            
            self.db.commit()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Geçersiz kullanıcı adı veya şifre"
            )
        
        user.failed_login_attempts = 0
        user.locked_until = None
        self.db.commit()
        
        return user
    
    def create_default_account(self, user_id: int):
        account = models.Account(
            account_number=generate_account_number(),
            user_id=user_id,
            account_type="checking",
            balance=Decimal("0.00"),
            currency="TRY"
        )
        
        self.db.add(account)
        self.db.commit()

class AccountService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_user_accounts(self, user_id: int):
        return self.db.query(models.Account).filter(
            and_(models.Account.user_id == user_id, models.Account.is_active == True)
        ).all()
    
    def get_account_by_number(self, account_number: str) -> models.Account:
        account = self.db.query(models.Account).filter(
            models.Account.account_number == account_number
        ).first()
        
        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hesap bulunamadı"
            )
        
        return account
    
    def create_account(self, user_id: int, account_data: schemas.AccountCreate) -> models.Account:
        account = models.Account(
            account_number=generate_account_number(),
            user_id=user_id,
            account_type=account_data.account_type,
            currency=account_data.currency,
            daily_limit=account_data.daily_limit
        )
        
        self.db.add(account)
        self.db.commit()
        self.db.refresh(account)
        
        return account
    
    def get_balance(self, account_number: str, user_id: int) -> schemas.BalanceResponse:
        account = self.db.query(models.Account).filter(
            and_(
                models.Account.account_number == account_number,
                models.Account.user_id == user_id,
                models.Account.is_active == True
            )
        ).first()
        
        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hesap bulunamadı"
            )
        
        return schemas.BalanceResponse(
            account_number=account.account_number,
            balance=account.balance,
            currency=account.currency
        )

class TransactionService:
    def __init__(self, db: Session):
        self.db = db
    
    def transfer_money(self, from_account_number: str, user_id: int, 
                      transaction_data: schemas.TransactionCreate) -> models.Transaction:
        
        from_account = self.db.query(models.Account).filter(
            and_(
                models.Account.account_number == from_account_number,
                models.Account.user_id == user_id,
                models.Account.is_active == True
            )
        ).first()
        
        if not from_account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Gönderen hesap bulunamadı"
            )
        
        to_account = self.db.query(models.Account).filter(
            and_(
                models.Account.account_number == transaction_data.to_account_number,
                models.Account.is_active == True
            )
        ).first()
        
        if not to_account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Alıcı hesap bulunamadı"
            )
        
        if from_account.balance < transaction_data.amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Yetersiz bakiye"
            )
        
        daily_total = self.get_daily_transaction_total(from_account.id)
        if daily_total + transaction_data.amount > from_account.daily_limit:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Günlük transfer limiti aşıldı"
            )
        
        transaction = models.Transaction(
            transaction_id=str(uuid.uuid4()),
            from_account_id=from_account.id,
            to_account_id=to_account.id,
            amount=transaction_data.amount,
            transaction_type="transfer",
            description=transaction_data.description,
            status="pending"
        )
        
        self.db.add(transaction)
        
        from_account.balance -= transaction_data.amount
        to_account.balance += transaction_data.amount
        
        transaction.status = "completed"
        transaction.completed_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(transaction)
        
        return transaction
    
    def get_daily_transaction_total(self, account_id: int) -> Decimal:
        today = datetime.utcnow().date()
        total = self.db.query(models.Transaction).filter(
            and_(
                models.Transaction.from_account_id == account_id,
                models.Transaction.status == "completed",
                models.Transaction.created_at >= today
            )
        ).with_entities(models.Transaction.amount).all()
        
        return sum([t.amount for t in total], Decimal("0.00"))
    
    def get_transaction_history(self, account_number: str, user_id: int, 
                              page: int = 1, per_page: int = 20) -> schemas.TransactionHistory:
        
        account = self.db.query(models.Account).filter(
            and_(
                models.Account.account_number == account_number,
                models.Account.user_id == user_id
            )
        ).first()
        
        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hesap bulunamadı"
            )
        
        offset = (page - 1) * per_page
        
        transactions = self.db.query(models.Transaction).filter(
            or_(
                models.Transaction.from_account_id == account.id,
                models.Transaction.to_account_id == account.id
            )
        ).order_by(models.Transaction.created_at.desc()).offset(offset).limit(per_page).all()
        
        total_count = self.db.query(models.Transaction).filter(
            or_(
                models.Transaction.from_account_id == account.id,
                models.Transaction.to_account_id == account.id
            )
        ).count()
        
        return schemas.TransactionHistory(
            transactions=transactions,
            total_count=total_count,
            page=page,
            per_page=per_page
        )

class AuditService:
    def __init__(self, db: Session):
        self.db = db
    
    def log_action(self, user_id: int, action: str, details: str, ip_address: str = None, user_agent: str = None):
        audit_log = models.AuditLog(
            user_id=user_id,
            action=action,
            details=details,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        self.db.add(audit_log)
        self.db.commit() 
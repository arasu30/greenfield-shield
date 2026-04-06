from sqlalchemy.orm import Session
from app.models.claim import Claim, ClaimStatus
from app.api.schemas.claim import ClaimCreate, ClaimUpdate
from typing import List

class ClaimCRUD:
    @staticmethod
    def create_claim(db: Session, farmer_id: int, claim_data: ClaimCreate) -> Claim:
        from app.models.policy import Policy, PolicyStatus
        # Bug 8: Check if policy is active
        policy = db.query(Policy).filter(
            Policy.id == claim_data.policy_id,
            Policy.farmer_id == farmer_id
        ).first()
        
        if not policy or policy.status != PolicyStatus.ACTIVE:
            raise ValueError("You can only file claims for active policies.")

        db_claim = Claim(
            farmer_id=farmer_id,
            **claim_data.model_dump()
        )
        db.add(db_claim)
        db.commit()
        db.refresh(db_claim)
        return db_claim

    @staticmethod
    def get_claims(db: Session, status: str = None) -> List[Claim]:
        query = db.query(Claim)
        if status:
            query = query.filter(Claim.status == status)
        return query.order_by(Claim.created_at.desc()).all()

    @staticmethod
    def get_claims_by_farmer(db: Session, farmer_id: int) -> List[Claim]:
        return db.query(Claim).filter(Claim.farmer_id == farmer_id).all()

    @staticmethod
    def get_claim_by_id(db: Session, claim_id: int) -> Claim:
        return db.query(Claim).filter(Claim.id == claim_id).first()

    @staticmethod
    def update_claim_status(db: Session, claim_id: int, status: ClaimStatus) -> Claim:
        db_claim = ClaimCRUD.get_claim_by_id(db, claim_id)
        if db_claim:
            db_claim.status = status
            db.commit()
            db.refresh(db_claim)
        return db_claim

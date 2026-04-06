from sqlalchemy.orm import Session
from typing import List
from app.models.policy import Policy, PolicyStatus
from app.api.schemas.policy import PolicyCreate
from datetime import datetime, timedelta

class PolicyCRUD:
    @staticmethod
    def create_policy(db: Session, farmer_id: int, policy_data: PolicyCreate) -> Policy:
        # Dynamic duration based on season
        duration_days = 150 if policy_data.season.lower() == "kharif" else 180
        start_date = datetime.now()
        end_date = start_date + timedelta(days=duration_days)
        
        new_policy = Policy(
            farmer_id=farmer_id,
            scheme_id=policy_data.scheme_id,
            crop_type=policy_data.crop_type,
            season=policy_data.season,
            premium=policy_data.premium,
            coverage=policy_data.coverage,
            status=PolicyStatus.ACTIVE,
            proofs=policy_data.proofs,
            start_date=start_date,
            end_date=end_date
        )
        db.add(new_policy)
        db.commit()
        db.refresh(new_policy)
        return new_policy

    @staticmethod
    def get_policies_by_farmer(db: Session, farmer_id: int):
        return db.query(Policy).filter(Policy.farmer_id == farmer_id).order_by(Policy.created_at.desc()).all()

    @staticmethod
    def get_active_policies_count(db: Session, farmer_id: int):
        return db.query(Policy).filter(
            Policy.farmer_id == farmer_id, 
            Policy.status == PolicyStatus.ACTIVE
        ).count()

    @staticmethod
    def get_all_policies(db: Session, status: str = None) -> List[Policy]:
        # Bug 13: Auto-expire policies on fetch
        db.query(Policy).filter(
            Policy.status == PolicyStatus.ACTIVE,
            Policy.end_date < datetime.now()
        ).update({"status": PolicyStatus.EXPIRED})
        db.commit()

        query = db.query(Policy)
        if status:
            query = query.filter(Policy.status == status)
        return query.order_by(Policy.created_at.desc()).all()

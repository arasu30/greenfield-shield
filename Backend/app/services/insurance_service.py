from sqlalchemy.orm import Session
from app.models.insurance_rate import InsuranceRate

class InsuranceService:
    COVERAGE_MULTIPLIER = 50.0  # From frontend, coverage is premium * 50

    @classmethod
    def calculate_premium(cls, db: Session, crop_type: str, season: str, area_acres: float) -> dict:
        """
        Calculate premium and suggested coverage based on crop type, season, and area.
        Returns a dictionary with 'premium' and 'coverage'.
        """
        if area_acres <= 0:
            raise ValueError("Area must be greater than 0")

        # Get rate from database
        rate_record = db.query(InsuranceRate).filter(
            InsuranceRate.crop_type == crop_type,
            InsuranceRate.season == season
        ).first()
        
        # Fallback to defaults if not in DB
        if rate_record:
            base_rate = rate_record.base_rate
        else:
            defaults = {"Rice": 1200, "Wheat": 1000, "Cotton": 1500, "Sugarcane": 1800, "Maize": 900}
            base_rate = defaults.get(crop_type, 1000)
        
        # Season multiplier (if not already factored into DB rate)
        # Assuming DB rate is the finalized rate per acre
        premium = round(base_rate * area_acres)
        coverage = round(premium * cls.COVERAGE_MULTIPLIER)

        return {
            "premium": float(premium),
            "coverage": float(coverage)
        }

    @classmethod
    def calculate_payout(cls, coverage: float, damage_percentage: float) -> float:
        """
        Calculate payout amount based on total coverage and damage percentage.
        """
        if coverage < 0:
            raise ValueError("Coverage must be non-negative")
        if not (0 <= damage_percentage <= 100):
            raise ValueError("Damage percentage must be between 0 and 100")

        payout = coverage * (damage_percentage / 100.0)
        return float(round(payout, 2))

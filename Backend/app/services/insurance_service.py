from sqlalchemy.orm import Session
from app.models.insurance_rate import InsuranceRate

class InsuranceService:
    COVERAGE_MULTIPLIER = 50.0  # From frontend, coverage is premium * 50

    @classmethod
    def calculate_premium(cls, db: Session, crop_type: str, season: str, area_acres: float) -> dict:
        """
        Calculate industry-grade commercial premium and sum insured (coverage).
        Returns total market cost before government subsidies.
        """
        if area_acres <= 0:
            raise ValueError("Area must be greater than 0")

        # Industry standard: Sum Insured per Acre (Market Value of Crop)
        # Rice/Cotton are high-value, Maize/Wheat are moderate.
        SUM_INSURED_PER_ACRE = {
            "Rice": 50000,
            "Wheat": 35000,
            "Cotton": 45000,
            "Sugarcane": 60000,
            "Maize": 30000,
            "Soybean": 32000
        }
        
        # Premium Rate (%) - Commercial rates before govt subsidy (usually 1.5% - 5%)
        # Rabi (Winter) crops usually have lower rates than Kharif (Monsoon).
        BASE_RATES = {
            "Rice": 3.5 if season == "Kharif" else 2.5,
            "Wheat": 2.0,
            "Cotton": 4.5,
            "Sugarcane": 5.0,
            "Maize": 2.5,
            "Soybean": 3.0
        }

        sum_insured_per_acre = SUM_INSURED_PER_ACRE.get(crop_type, 30000)
        rate_percentage = BASE_RATES.get(crop_type, 2.5)

        # Get rate from database if available (overrides defaults)
        rate_record = db.query(InsuranceRate).filter(
            InsuranceRate.crop_type == crop_type,
            InsuranceRate.season == season
        ).first()
        
        if rate_record:
            rate_percentage = rate_record.base_rate

        # Calculation
        total_sum_insured = round(sum_insured_per_acre * area_acres)
        total_market_premium = round(total_sum_insured * (rate_percentage / 100))

        return {
            "premium": float(total_market_premium),
            "coverage": float(total_sum_insured),
            "rate_percent": float(rate_percentage)
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

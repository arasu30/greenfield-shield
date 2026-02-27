from pydantic import BaseModel


class Prediction(BaseModel):
    label: str
    description: str
    probability: float


class PredictionResponse(BaseModel):
    predictions: list[Prediction]

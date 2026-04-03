from app.database.session import engine
from sqlalchemy import inspect

def check_tables():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Tables: {tables}")
    if "claims" in tables:
        columns = [c["name"] for c in inspector.get_columns("claims")]
        print(f"Columns in 'claims': {columns}")
    if "insurance_rates" in tables:
        print("'insurance_rates' table exists.")
    else:
        print("'insurance_rates' table DOES NOT exist.")

if __name__ == "__main__":
    check_tables()

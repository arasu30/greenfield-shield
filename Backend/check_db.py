from app.database.session import SessionLocal
from app.models.user import User, UserRole

def check_admin():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"Total Users: {len(users)}")
        for u in users:
            print(f"User: {u.email}, Role: {u.role}, Type: {type(u.role)}")
    finally:
        db.close()

if __name__ == "__main__":
    check_admin()

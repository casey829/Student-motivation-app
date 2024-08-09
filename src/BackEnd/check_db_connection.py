from run import create_app
from sqlalchemy import text

def check_db_connection():
    app = create_app()
    with app.app_context():
        try:
            with app.extensions['sqlalchemy'].engine.connect() as connection:
                connection.execute(text('SELECT 1'))
            print("Database connection is successful.")
        except Exception as e:
            print(f"Database connection failed: {e}")

if __name__ == "__main__":
    check_db_connection()

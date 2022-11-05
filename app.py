from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import azure.cosmos.cosmos_client as cosmos_client
from flask_login import LoginManager, UserMixin
from urllib import parse
import os
import secrets
from dotenv import load_dotenv
load_dotenv()
# Columns=27, Encoding=1252

def create_app():

    application = Flask(__name__)

    # connect to SQL database
    server = "510-emergencies.database.windows.net"
    database = "relief-app-users"
    username = os.getenv("SQL_USERNAME")
    password = os.getenv("SQL_PASSWORD")
    driver = '{ODBC Driver 17 for SQL Server}'
    odbc_str = 'DRIVER=' + driver + ';SERVER=' + server + ';PORT=1433;UID=' + username + ';DATABASE=' + database + ';PWD=' + password
    application.config['SECRET_KEY'] = secrets.token_urlsafe(16)
    application.config['SQLALCHEMY_DATABASE_URI'] = 'mssql+pyodbc:///?odbc_connect=' + parse.quote_plus(odbc_str)
    application.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
    db = SQLAlchemy(application)

    # connect to cosmos database
    settings = {
        'host': os.environ.get('ACCOUNT_HOST', 'https://emergencycosmos.documents.azure.com:443/'),
        'master_key': os.getenv('COSMOS_KEY'),
        'database_id': os.environ.get('COSMOS_DATABASE', 'ReliefApp'),
        'container_id': os.environ.get('COSMOS_CONTAINER', 'Beneficiaries'),
    }
    client = cosmos_client.CosmosClient(settings['host'],
                                        {'masterKey': settings['master_key']},
                                        user_agent="ReliefApp",
                                        user_agent_overwrite=True)
    cosmos_db = client.get_database_client(settings['database_id'])

    with application.app_context():
        db.create_all()
        application.config['SQLALCHEMY_DATABASE'] = db
        application.config['COSMOS_DATABASE'] = cosmos_db
    application.app_context().push()

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(application)

    from models import User

    @login_manager.user_loader
    def load_user(user_id):
        # since the user_id is just the primary key of our user table, use it in the query for the user
        return User.query.get(int(user_id))

    # blueprint for auth routes in our app
    from auth import auth as auth_blueprint
    application.register_blueprint(auth_blueprint)

    # blueprint for intra-distribution
    from distrib import distrib as distrib_blueprint
    application.register_blueprint(distrib_blueprint)

    # blueprint for in-distribution
    from main import main as main_blueprint
    application.register_blueprint(main_blueprint)

    return application


if __name__ == '__main__':
    app = create_app()
    app.run()
else:
    app = create_app()

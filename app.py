from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import sys
import azure.cosmos.cosmos_client as cosmos_client
from flask_login import LoginManager, UserMixin
from urllib import parse
import os
import secrets
import webbrowser
from threading import Timer
from dotenv import load_dotenv
load_dotenv()


def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/')


def create_app():
    if getattr(sys, 'frozen', False):
        template_folder = os.path.join(sys._MEIPASS, 'templates')
        static_folder = os.path.join(sys._MEIPASS, 'static')
        application = Flask(__name__, template_folder=template_folder, static_folder=static_folder)
    else:
        application = Flask(__name__)

    # connect to SQL database
    if os.getenv("MODE") == "online":
        server = "510-emergencies.database.windows.net"
        database = "relief-app-users"
        username = os.getenv("SQL_USERNAME")
        password = os.getenv("SQL_PASSWORD")
        driver = '{ODBC Driver 17 for SQL Server}'
        odbc_str = 'DRIVER=' + driver + ';SERVER=' + server + ';PORT=1433;UID=' + username + ';DATABASE=' + database + ';PWD=' + password
        application.config['SECRET_KEY'] = secrets.token_urlsafe(16)
        application.config['SQLALCHEMY_DATABASE_URI'] = 'mssql+pyodbc:///?odbc_connect=' + parse.quote_plus(odbc_str)
        application.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
    elif os.getenv("MODE") == "offline":
        application.config['SECRET_KEY'] = 'secret'
        application.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
    db = SQLAlchemy(application)

    # define tables
    class User(UserMixin, db.Model):
        id = db.Column(db.Integer, primary_key=True)  # primary keys are required by SQLAlchemy
        email = db.Column(db.String(100), unique=True)
        password = db.Column(db.String(100))
        name = db.Column(db.String(1000))

    class Distribution(db.Model):
        id = db.Column(db.Integer, primary_key=True)  # primary keys are required by SQLAlchemy
        user_email = db.Column(db.String(100))
        name = db.Column(db.String(100))
        place = db.Column(db.String(100))
        date = db.Column(db.Date)
        items = db.Column(db.String(100))
        donor = db.Column(db.String(100))

    # connect to cosmos database
    if os.getenv("MODE") == "online":
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
    elif os.getenv("MODE") == "offline":
        cosmos_db = 'json'
    else:
        cosmos_db = ''

    with application.app_context():
        db.create_all()
        application.config['SQLALCHEMY_DATABASE'] = db
        application.config['COSMOS_DATABASE'] = cosmos_db
    application.app_context().push()

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(application)

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
    Timer(1, open_browser).start()
    app.run(host='0.0.0.0', port=5000)
else:
    app = create_app()

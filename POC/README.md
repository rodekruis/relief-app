# ReliefBox

A simple web app for relief.
https://relief-system-webapp.azurewebsites.net/

## Description

Synopsis: a [flask python app](https://flask.palletsprojects.com/en/2.0.x/).

Workflow: upload data of beneficiaries, start distribution, check if beneficiaries are eligible, download report.

## Setup

### on Azure
1. [Deploy the web app to Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/quickstart-python)
3. Add necessary keys as environmental variables. From Azure Portal, App Service > Configuration > New application setting
```
SQL_USERNAME=...
SQL_PASSWORD=...
COSMOS_KEY=...
MODE=online
```

### build as standalone app
```
pyinstaller --onefile --add-data 'templates;templates' --add-data 'static;static' --add-data 'data;data' --add-data './*.py;.' app.py
```

### on Raspberry Pi 4
1. [Create wireless access point](https://raspberrypi-guide.github.io/networking/create-wireless-access-point#start-up-the-wireless-access-point)
2. Clone this repository
```
$ git clone https://github.com/rodekruis/relief-app.git
$ cd relief-app
```
3. Set offline mode in .env
```
$ echo -n "MODE=offline" > .env
```
4. Install app dependencies and run it
```
$ sudo apt-get update
$ sudo apt-get install libatlas-base-dev libcblas-dev g++ unixodbc-dev
$ pip install -r requirements.txt
$ python app.py
```
Debug connection issues (to be improved):
```
$ sudo systemctl stop hostapd
$ sudo systemctl unmask hostapd
$ sudo systemctl enable hostapd
$ sudo systemctl start hostapd
```

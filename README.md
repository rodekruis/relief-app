# ReliefBox

A simple web app for relief.
https://relief-system-webapp.azurewebsites.net/

## Description

Synopsis: a [flask python app](https://flask.palletsprojects.com/en/2.0.x/).

Worflow: upload data of beneficiaries, start distribution, check if beneficiaries are eligible, download report.

## Setup

To be added.

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
4. Run the app
```
$ sudo apt-get update
$ sudo apt-get install libatlas-base-dev libcblas-dev g++ unixodbc-dev
$ pip install -r requirements.txt
$ python app.py
```

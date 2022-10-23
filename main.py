from flask import Blueprint, render_template
from flask_login import login_required, current_user
from flask import Flask, render_template, Response, jsonify, request, send_file, session
import cv2
from PIL import Image
import base64
import io
import numpy as np
from pyzbar.pyzbar import decode
import azure.cosmos.exceptions as exceptions
import os
import pandas as pd
import json
from datetime import datetime
from flask import current_app
cosmos_db = current_app.config['COSMOS_DATABASE']
cosmos_container = cosmos_db.get_container_client('Beneficiaries')
main = Blueprint('main', __name__)


@main.route('/choose_input_method', methods=['GET', 'POST'])
@login_required
def choose_input_method():
    return render_template('choose_input_method.html')


@main.route('/save_input_method', methods=['POST'])
@login_required
def save_input_method():
    if 'input_method' in request.form.keys():
        session['input_method'] = request.form['input_method']
        print('saving input method:', session['input_method'])
        if session['input_method'] == 'text':
            return render_template('input.html')
        elif session['input_method'] == 'video':
            return render_template('input_video.html')
    else:
        return render_template('choose_input_method.html')


@main.route('/input', methods=['GET'])
@login_required
def get_input():
    if 'input_method' in session.keys():
        print('input method is:', session['input_method'])
        if session['input_method'] == 'text':
            return render_template('input.html')
        elif session['input_method'] == 'video':
            return render_template('input_video.html')
    else:
        return render_template('choose_input_method.html')


def query_items_by_partition_key(container, key):
    # print('\nQuerying by Partition Key\n')
    # Including the partition key value of account_number in the WHERE filter results in a more efficient query
    items = list(container.query_items(
        query="SELECT * FROM r WHERE r.partitionKey=@key",
        parameters=[
            {"name": "@key", "value": key}
        ]
    ))
    return items


@main.route('/entry', methods=['POST', 'GET'])
@login_required
def beneficiary():
    """Get beneficiary data."""
    if 'code' in request.form.keys():
        if request.form['code'].strip() == '':
            return render_template('input.html')
        else:
            code = str(request.form['code'])
    elif 'code' in request.args.keys():
        if request.args['code'].strip() == '':
            return render_template('input.html')
        else:
            code = str(request.args['code'])
    else:
        return render_template('input.html')

    try:
        beneficiary_data = cosmos_container.read_item(item=code,
                                                      partition_key=current_user.email)
        beneficiary_data = {k: v for k, v in beneficiary_data.items() if not str(k).startswith('_')}
        beneficiary_data.pop('id')
        beneficiary_data.pop('partitionKey')
        return render_template('entry.html',
                               data=beneficiary_data)
    except exceptions.CosmosResourceNotFoundError:
         return render_template('entry_not_found.html')


def replace_item(container, item_id, key, replace_body):
    read_item = container.read_item(item=item_id, partition_key=key)
    for key in replace_body.keys():
        read_item[key] = replace_body[key]
    container.replace_item(item=read_item, body=read_item)


@main.route('/received', methods=['POST'])
@login_required
def received():
    if 'code' in request.form.keys():
        try:
            replace_body = {
                'recipient': 'Yes',
                'received_when': datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
            }
            replace_item(cosmos_container,
                         item_id=str(request.form['code']),
                         key=current_user.email,
                         replace_body=replace_body)
        except exceptions.CosmosResourceNotFoundError:
             pass
    return get_input()


def process_data(partition_key):
    raw_data_path = 'data/data_raw.xlsx'
    try:
        df = pd.read_excel(raw_data_path)
        df.columns = df.columns.str.lower()
        df['code'] = df['code'].astype(str)
        if df['code'].duplicated().any():  # flag duplicated codes
            return 'duplicates'  # TBI
        df = df.drop([col for col in df.columns if col.startswith('_')], axis=1)  # drop KoBo columns
        if 'recipient' not in df.columns:
            df['recipient'] = 'No'
        if 'received_when' not in df.columns:
            df['received_when'] = None

        # drop KoBo internal fields
        df = df[[col for col in df.columns if not col.startswith('_')]]

        # save to cosmos db
        for ix, row in df.iterrows():
            body = {}
            body['id'] = row['code']
            body['partitionKey'] = partition_key
            for key in row.keys():
                if key != 'id' and key != 'partitionKey':
                    body[key] = str(row[key])
            cosmos_container.create_item(body=body)
        os.remove(raw_data_path)
        return df
    except:
        return 'error'


@main.route('/upload_data', methods=['GET'])
@login_required
def upload_data():
    return render_template('upload_data.html')


@main.route('/uploader', methods=['POST'])
@login_required
def uploader():
    f = request.files['file']
    f.save('data/data_raw.xlsx')
    # empty existing database
    item_list = query_items_by_partition_key(cosmos_container, current_user.email)
    for item in item_list:
        cosmos_container.delete_item(item=item['id'], partition_key=current_user.email)
    # then upload the new one
    df = process_data(partition_key=current_user.email)
    if type(df) == str:
        if df == 'duplicates':
            return render_template('duplicate_error.html')
        elif df == 'error':
            return render_template('upload_error.html')
    return render_template('view_data.html', tables=[df.to_html(classes='table', col_space=10)], titles=df.columns.values)


def get_data():
    item_list = query_items_by_partition_key(cosmos_container, current_user.email)
    if len(item_list) == 0:
        return None
    else:
        df = pd.DataFrame(item_list)
        df = df.drop(columns=['partitionKey'])
        df = df[[col for col in df.columns if not col.startswith('_')]]
        return df


@main.route('/view_data', methods=['POST'])
@login_required
def view_data():
    data = get_data()
    if data is None:
        return render_template('no_data.html')
    else:
        data = data.drop(columns=['id'])
        return render_template('view_data.html',
                               tables=[data.to_html(classes='table', col_space=10)],
                               titles=data.columns.values)


@main.route('/missing', methods=['POST'])
@login_required
def missing():
    data = get_data()
    if data is None:
        return render_template('no_data.html')
    else:
        data = data[data['recipient'] == 'No']
        return render_template('view_data.html',
                               tables=[data.to_html(classes='table', col_space=10)],
                               titles=data.columns.values)


@main.route("/download_data", methods=['POST'])
@login_required
def download_data():
    data = get_data()
    if data is None:
        return render_template('no_data.html')
    else:
        data_path = 'data/data_processed.xlsx'
        data.to_excel(data_path, index=False)
        writer = pd.ExcelWriter(data_path, engine='xlsxwriter')
        data.to_excel(writer, sheet_name='DATA', index=False)  # send df to writer
        worksheet = writer.sheets['DATA']  # pull worksheet object
        for idx, col in enumerate(data.columns):  # loop through all columns
            series = data[col]
            max_len = max((
                series.astype(str).map(len).max(),  # len of largest item
                len(str(series.name))  # len of column name/header
            )) + 1
            worksheet.set_column(idx, idx, max_len)  # set column width
        writer.save()
        return send_file(data_path, as_attachment=True)


@main.route("/download_template", methods=['POST'])
@login_required
def download_template():
    return send_file('data/data_template.xlsx', as_attachment=True)


@main.route('/')
@login_required
def index():
    return render_template('index.html')


@main.route('/profile')
def profile():
    return render_template('profile.html', name=current_user.name)
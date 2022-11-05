from flask import Blueprint, render_template, redirect, url_for, request, flash, session
from sqlalchemy import exc
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
from models import Distribution
from flask import current_app
from main import query_items_by_partition_key, filter_by_distribution
db = current_app.config['SQLALCHEMY_DATABASE']
cosmos_db = current_app.config['COSMOS_DATABASE']
cosmos_container = cosmos_db.get_container_client('Beneficiaries')
distrib = Blueprint('distrib', __name__)


@distrib.route('/index_distrib')
@login_required
def index_distrib():
    return render_template('index_distrib.html')


@distrib.route('/name_distrib', methods=['GET'])
@login_required
def name_distrib():
    return render_template('name_distrib.html')


@distrib.route('/create_distrib', methods=['POST'])
@login_required
def create_distrib():
    if 'distrib_name' in request.form.keys():

        if request.form['distrib_name'] == "":
            flash('Please specify the name of the distribution.')
            return redirect(url_for('distrib.name_distrib'))

        # create distrib
        distrib = Distribution.query.filter_by(
            user_email=current_user.email,
            name=request.form['distrib_name']
        ).first()  # if this returns a distribution, then the name already exists in database

        if distrib:  # if a distribution is found, redirect back to name_distrib
            flash(f"Distribution {request.form['distrib_name']} already exists")
            return redirect(url_for('distrib.name_distrib'))

        # create a new distribution
        new_distrib = Distribution(
            user_email=current_user.email,
            name=request.form['distrib_name']
        )

        # add the new distribution to the database
        db.session.add(new_distrib)
        db.session.commit()

        db.session.flush()

        session['distrib_id'] = new_distrib.id
        session['distrib_name'] = request.form['distrib_name']
        return redirect(url_for('main.index'))
    else:
        return render_template('name_distrib.html')


@distrib.route('/list_distrib', methods=['GET'])
@login_required
def list_distrib():
    distributions = Distribution.query.filter_by(user_email=current_user.email)
    distrib_data = {}
    for distrib in distributions:
        distrib_data[distrib.name] = distrib.id
    if len(distrib_data) == 0:
        return render_template('no_distrib.html')
    else:
        return render_template('list_distrib.html',
                               data=distrib_data)


@distrib.route('/select_distrib', methods=['POST'])
@login_required
def select_distrib():
    if 'distrib_id' in request.form.keys() and 'distrib_name' in request.form.keys():
        session['distrib_id'] = request.form['distrib_id']
        session['distrib_name'] = request.form['distrib_name']
        return redirect(url_for('main.index'))
    else:
        return render_template('list_distrib.html')


@distrib.route('/list_distrib_delete', methods=['GET'])
@login_required
def list_distrib_delete():
    distributions = Distribution.query.filter_by(user_email=current_user.email)
    distrib_data = {}
    for distrib in distributions:
        distrib_data[distrib.name] = distrib.id
    if len(distrib_data) == 0:
        return render_template('no_distrib.html')
    else:
        return render_template('list_distrib_delete.html',
                               data=distrib_data)


@distrib.route('/delete_distrib_confirm', methods=['POST'])
@login_required
def delete_distrib_confirm():
    if 'distrib_id' in request.form.keys():
        session['distrib_id'] = request.form['distrib_id']
        return render_template('delete_distrib_confirm.html',
                               distrib_id=session['distrib_id'])
    else:
        return render_template('list_distrib_delete.html')


@distrib.route('/delete_distrib', methods=['POST'])
@login_required
def delete_distrib():
    if 'distrib_id' in request.form.keys():
        session['distrib_id'] = request.form['distrib_id']
        # delete beneficiaries
        item_list = query_items_by_partition_key(cosmos_container, current_user.email)
        item_list = filter_by_distribution(item_list)
        for item in item_list:
            cosmos_container.delete_item(item=item['id'], partition_key=current_user.email)
        # delete distribution
        distrib_to_delete = Distribution.query.filter_by(id=session['distrib_id']).first()
        db.session.delete(distrib_to_delete)
        db.session.commit()
        return render_template('index_distrib.html')
    else:
        return render_template('list_distrib_delete.html')



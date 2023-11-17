import { RouteEvents } from "../../RouteEvents.js";
import { Database } from "../Database.js";
import { ResponseTools } from "../ResponseTools.js";
import { ActiveSession } from "../ActiveSession.js";
/*
@main.route('/entry', methods=['POST', 'GET'])
@login_required
def beneficiary():
    """Get beneficiary data."""
    if 'distrib_id' not in session.keys():
        return render_template('index_distrib.html')

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

    beneficiary_data = get_beneficiary_entry(beneficiary_id=str(session['distrib_id'])+str(code),
                                             user_email=current_user.email,
                                             distrib_id=session['distrib_id'])
    if beneficiary_data == "not_found":
        return render_template('entry_not_found.html')
    elif beneficiary_data == "no_data":
        return render_template('no_data.html')
    else:
        for internal_field in ['id', 'distrib_id', 'partitionKey']:
            if internal_field in beneficiary_data.keys():
                beneficiary_data.pop(internal_field)
        return render_template('entry.html',
                               data=beneficiary_data)
*/
export class BeneficiaryCodePostHandler {
    canHandleEvent(event) {
        return event.request.url.includes(RouteEvents.checkBenificiaryCodeInputMethod);
    }
    async handleEvent(event) {
        todo;
        continue here;
        if (this.isBenificiaryCodePartOfCurrentDistribution(this.beneficiaryCodeFromRequest(event.request))) {
            return ResponseTools.wrapInHtmlTemplate(RouteEvents.codeInputNotFound);
        }
        else {
            return ResponseTools.wrapInHtmlTemplate(RouteEvents.codeInputNotFound);
        }
    }
    beneficiaryCodeFromRequest(request) {
        const url = new URL(request.url);
        return url.searchParams.get('code');
    }
    async isBenificiaryCodePartOfCurrentDistribution(code) {
        const nameOfActiveDistribution = ActiveSession.singleton.nameOfLastViewedDistribution;
        if (typeof nameOfActiveDistribution === 'string') {
            const distributions = await Database.instance.distributionsWithName(nameOfActiveDistribution);
            if (distributions.length > 0) {
                const benificiaries = await Database.instance.benificiariesForDistribution(distributions[0]);
                benificiaries[0].comma_separated_cells;
            }
            else {
                console.error("Active distrution named " + nameOfActiveDistribution + " not found in database");
            }
        }
        return false;
    }
}

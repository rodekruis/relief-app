import { match } from "assert";
import { ActiveSession } from "../SessionState/ActiveSession";

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


export class BeneficiaryEligilityService {
    activeSession: ActiveSession;

    constructor(activeSession: ActiveSession) {
        this.activeSession = activeSession
    }

    async isBenificiaryEligibleForCurrentDistribution(beneficiaryCode: string | undefined): Promise<boolean> {
        const nameOfActiveDistribution = this.activeSession.nameOfLastViewedDistribution
        if(nameOfActiveDistribution) {
            const distribution = await this.activeSession.database.distributionWithName(nameOfActiveDistribution)
            if(distribution) {
                const beneficiaries = await this.activeSession.database.benificiariesForDistribution(distribution)
                console.log(beneficiaries)
                const matchedBeneficiaries = beneficiaries.filter((beneficiary) => {
                    beneficiary.code == beneficiaryCode
                })
                if(matchedBeneficiaries.length == 1) {
                    return true
                } else {
                    return false
                }
            } else {
                console.error("Active distrution named " + nameOfActiveDistribution + " not found in database")
                return false
            }
        } else {
            throw Error("Expected active distribution")
        }
        return false
      }
}
import { RouteEvents } from "../../RouteEvents.js";
import { FetchEvent } from "../../Interfaces/FetchEvent.js";
import { FetchEventHandler } from "../../Interfaces/FetchEventHandler.js";
import { ResponseTools } from "../ResponseTools.js";
import { BeneficiaryEligilityService } from "../BeneficiaryEligilityService.js";
import { ActiveSession, ActiveSessionContainer } from "../ActiveSession.js";


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

export class BeneficiaryCodePostHandler extends ActiveSessionContainer implements FetchEventHandler {
    eligebilityService = new BeneficiaryEligilityService(this.activeSession)

  canHandleEvent(event: FetchEvent): boolean {
    return event.request.url.includes(RouteEvents.checkBeneficiaryCodeInputMethod);
  }

  async handleEvent(event: FetchEvent): Promise<Response> {
    const beneficiaryCode = this.beneficiaryCodeFromRequest(event.request)
    if (beneficiaryCode) {
      const beneficiary = await this.activeSession.database.beneficiaryWithCode(beneficiaryCode)
      if(beneficiary) {
        return ResponseTools.wrapInHTPLTemplateAndReplaceKeysWithValues(
          RouteEvents.codeInputFound, {
            eligibility_info_box_id: await this.eligebilityService.isBeneficiaryEligibleForCurrentDistribution(beneficiaryCode) ? "eligible" : "noteligible",
            eligibility_info_name: beneficiary.code,
            eligibility_info_values: beneficiary.values,
          }
        )
      } else {
          return ResponseTools.wrapInHtmlTemplate(RouteEvents.codeInputNotFound)
      }
    } else {
      console.error("Failed to retrieve code from URL")
      return ResponseTools.wrapInHtmlTemplate(RouteEvents.codeInputNotFound)
    }
  }

  private beneficiaryCodeFromRequest(request: Request): string | undefined {
    const url = new URL(request.url)
    return url.searchParams.get('code') ?? undefined
  }
}
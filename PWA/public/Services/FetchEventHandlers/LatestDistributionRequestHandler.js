import { RouteEvents } from "../RouteEvents.js";
import { ResponseTools } from "../Services/ResponseTools.js";
import { Database, ObjectStore } from "../Database/Database.js";
export class LatestDistributionRequestHandler {
    canHandleEvent(event) {
        return event.request.url.endsWith(RouteEvents.latestDistribution);
    }
    /*
  {% if number_beneficiaries > 0 %}
              <label class="label is-small" style="font-size:100%">Beneficiaries served: {{ number_recipients }} / {{ number_beneficiaries }}</label>
              {% else %}
              <label class="label is-small" style="font-size:100%">No beneficiary data found</label>
              {% endif %}
  */
    async handleEvent(event) {
        try {
            const distributions = await Database.instance.getElement(ObjectStore.distribution);
            const latestDistribution = distributions[distributions.length - 1];
            //TODO: move distributions display logic to shared handler (if current handler is still needed)
            return ResponseTools.replaceTemplateKeysWithValues(await fetch(RouteEvents.distributionsHome), {
                distrib_name: latestDistribution.distrib_name,
                distrib_place: latestDistribution.distrib_place,
                distrib_date: latestDistribution.distrib_date,
                beneficiary_info: this.benificiaryInfoTextFromDistribution(latestDistribution)
            });
        }
        catch {
            return Promise.reject("database error");
        }
    }
    isFilled(field) {
        return field.length != 0;
    }
    benificiaryInfoTextFromDistribution(distribution) {
        return "Progress..";
    }
}

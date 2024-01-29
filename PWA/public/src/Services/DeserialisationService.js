export class DeserialisationService {
    static async deserializeFormDataFromRequest(request) {
        const formData = await request.clone().formData();
        return Object.fromEntries(formData.entries());
    }
}

export class DeserialisationService {
    static async deserializeFormDataFromRequest<T>(request: Request): Promise<T> {
        const formData = await request.clone().formData();
        return Object.fromEntries(formData.entries()) as unknown as T;
    }
}
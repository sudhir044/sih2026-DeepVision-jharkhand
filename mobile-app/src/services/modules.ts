import { apiRequest } from "./api";

export interface TrainingModule {
    id: number;
    code: string;
    title: string;
    description: string;
    duration: string | number;
    difficulty: string;
    status: string;
}

export async function getModules(): Promise<TrainingModule[]> {
    const data = await apiRequest("/api/modules");
    return data.modules || [];
}

export async function getModuleById(idOrCode: string | number): Promise<TrainingModule> {
    const data = await apiRequest(`/api/modules/${idOrCode}`);
    return data.module;
}

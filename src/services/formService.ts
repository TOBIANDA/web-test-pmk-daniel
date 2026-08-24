import apiClient, { API_BASE_URL } from "@/lib/axios";
import { DynamicForm, DynamicFormCreateInput, FormSubmission } from "@/types/form";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const formService = {
  /**
   * Get all dynamic forms
   */
  async getForms(activeOnly: boolean = false): Promise<DynamicForm[]> {
    const res = await apiClient.get<ApiResponse<DynamicForm[]>>("/dynamic-forms", {
      params: { active_only: activeOnly }
    });
    return res.data?.data || [];
  },

  /**
   * Get form by ID or slug
   */
  async getFormBySlugOrId(idOrSlug: string): Promise<DynamicForm | null> {
    const res = await apiClient.get<ApiResponse<DynamicForm>>(`/dynamic-forms/${idOrSlug}`);
    return res.data?.data || null;
  },

  /**
   * Create new form (Admin only)
   */
  async createForm(data: DynamicFormCreateInput): Promise<DynamicForm> {
    const res = await apiClient.post<ApiResponse<DynamicForm>>("/dynamic-forms", data);
    if (!res.data?.success || !res.data?.data) {
      throw new Error(res.data?.message || "Gagal membuat formulir");
    }
    return res.data.data;
  },

  /**
   * Update existing form (Admin only)
   */
  async updateForm(id: string, data: Partial<DynamicFormCreateInput>): Promise<DynamicForm> {
    const res = await apiClient.put<ApiResponse<DynamicForm>>(`/dynamic-forms/${id}`, data);
    if (!res.data?.success || !res.data?.data) {
      throw new Error(res.data?.message || "Gagal memperbarui formulir");
    }
    return res.data.data;
  },

  /**
   * Delete form (Admin only)
   */
  async deleteForm(id: string): Promise<void> {
    const res = await apiClient.delete<ApiResponse<null>>(`/dynamic-forms/${id}`);
    if (!res.data?.success) {
      throw new Error(res.data?.message || "Gagal menghapus formulir");
    }
  },

  /**
   * Submit answers to form (Public)
   */
  async submitForm(idOrSlug: string, answers: Record<string, any>): Promise<string> {
    const res = await apiClient.post<ApiResponse<{ submissionId: string }>>(
      `/dynamic-forms/${idOrSlug}/submit`,
      { answers }
    );
    if (!res.data?.success) {
      throw new Error(res.data?.message || res.data?.error || "Gagal mengirim tanggapan");
    }
    return res.data?.data?.submissionId || "success";
  },

  /**
   * Get all submissions for a form (Admin only)
   */
  async getSubmissions(formId: string): Promise<FormSubmission[]> {
    const res = await apiClient.get<ApiResponse<FormSubmission[]>>(`/dynamic-forms/${formId}/submissions`);
    return res.data?.data || [];
  },

  /**
   * Delete a single submission (Admin only)
   */
  async deleteSubmission(submissionId: string): Promise<void> {
    const res = await apiClient.delete<ApiResponse<null>>(`/dynamic-forms/submissions/${submissionId}`);
    if (!res.data?.success) {
      throw new Error(res.data?.message || "Gagal menghapus tanggapan");
    }
  },

  /**
   * Upload file attachment (Public)
   */
  async uploadAttachment(file: File): Promise<{ url: string; fileName: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post<ApiResponse<{ url: string; fileName: string }>>(
      "/dynamic-forms/upload-attachment",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!res.data?.success || !res.data?.data) {
      throw new Error(res.data?.message || res.data?.error || "Gagal mengunggah berkas");
    }

    return res.data.data;
  },

  /**
   * Get direct download CSV URL
   */
  getExportCsvUrl(formId: string): string {
    return `${API_BASE_URL}/dynamic-forms/${formId}/export-csv`;
  }
};

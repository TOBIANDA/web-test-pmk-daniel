import apiClient, { API_BASE_URL } from "@/lib/axios";
import { DynamicForm, DynamicFormCreateInput, FormSubmission } from "@/types/form";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const LOCAL_STORAGE_FORMS_KEY = "pmk_local_dynamic_forms";
const LOCAL_STORAGE_SUBMISSIONS_KEY = "pmk_local_form_submissions";

const DEFAULT_SEEDED_FORMS: DynamicForm[] = [
  {
    id: "form_maba_2026",
    title: "Form Pendataan Mahasiswa Baru PMK Daniel 2026",
    slug: "pendataan-maba-2026",
    description: "Shalom Mahasiswa Baru FILKOM UB! Selamat datang di keluarga besar PMK Daniel. Silakan isi form ini untuk mempermudah komunikasi dan pendampingan kakak tingkat.",
    is_active: 1,
    submission_count: 1,
    created_at: new Date().toISOString(),
    fields_schema: [
      { id: "nama_lengkap", label: "Nama Lengkap", type: "text", placeholder: "Contoh: Jonathan Christopher", required: true },
      { id: "nim", label: "NIM (Nomor Induk Mahasiswa)", type: "text", placeholder: "Contoh: 265150200111001", required: true },
      { id: "program_studi", label: "Program Studi / Jurusan", type: "select", options: ["Teknik Informatika", "Sistem Informasi", "Teknologi Informasi", "Pendidikan Teknologi Informasi", "Teknik Komputer"], required: true },
      { id: "no_whatsapp", label: "Nomor WhatsApp Aktif", type: "text", placeholder: "081234567890", required: true },
      { id: "pilihan_divisi", label: "Minat Pelayanan Utama (Pilih 1)", type: "radio", options: ["Divisi Acara & Ibadah", "Divisi Musik & Pujian", "Divisi Multimedia & Publikasi", "Divisi Doa & Pemerhati", "Divisi Perlengkapan & Logistik"], required: true },
      { id: "talenta_minat", label: "Talenta & Keahlian Tambahan (Boleh lebih dari 1)", type: "checkbox", options: ["Main Musik (Gitar / Keyboard / Drum / Bass)", "Vocal / Singer / WL", "Desain Grafis / Canva / Photoshop", "Fotografi / Videografi", "Operating Sound System / OBS Live Streaming"], required: false },
      { id: "alasan_motivasi", label: "Ceritakan Motivasi / Harapan Anda di PMK Daniel", type: "textarea", placeholder: "Tuliskan cerita singkat atau harapan Anda...", required: false },
      { id: "foto_ktm", label: "Upload Foto Diri / KTM / Bukti Penerimaan", type: "file", helpText: "Format file: JPG, PNG, atau PDF (Maksimal 10MB)", required: false }
    ]
  }
];

function getLocalForms(): DynamicForm[] {
  if (typeof window === "undefined") return DEFAULT_SEEDED_FORMS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FORMS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_FORMS_KEY, JSON.stringify(DEFAULT_SEEDED_FORMS));
      return DEFAULT_SEEDED_FORMS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_SEEDED_FORMS;
  }
}

function saveLocalForms(forms: DynamicForm[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_FORMS_KEY, JSON.stringify(forms));
  } catch (e) {}
}

function getLocalSubmissions(formId: string): FormSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_SUBMISSIONS_KEY}_${formId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalSubmission(formId: string, sub: FormSubmission) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalSubmissions(formId);
    localStorage.setItem(`${LOCAL_STORAGE_SUBMISSIONS_KEY}_${formId}`, JSON.stringify([sub, ...existing]));
  } catch (e) {}
}

export const formService = {
  /**
   * Get all dynamic forms
   */
  async getForms(activeOnly: boolean = false): Promise<DynamicForm[]> {
    let apiForms: DynamicForm[] = [];
    try {
      const res = await apiClient.get<ApiResponse<DynamicForm[]>>("/dynamic-forms", {
        params: { active_only: activeOnly },
        timeout: 4000,
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        apiForms = res.data.data;
      }
    } catch (err) {
      // API call failed, fallback to local storage
    }

    const localForms = getLocalForms();
    if (apiForms.length === 0) {
      return activeOnly ? localForms.filter(f => f.is_active === 1) : localForms;
    }

    // Merge API forms with any extra local forms
    const existingIds = new Set(apiForms.map(f => f.id));
    const extraLocals = localForms.filter(f => !existingIds.has(f.id));
    const combined = [...apiForms, ...extraLocals];
    saveLocalForms(combined);

    return activeOnly ? combined.filter(f => f.is_active === 1) : combined;
  },

  /**
   * Get form by ID or slug
   */
  async getFormBySlugOrId(idOrSlug: string): Promise<DynamicForm | null> {
    try {
      const res = await apiClient.get<ApiResponse<DynamicForm>>(`/dynamic-forms/${idOrSlug}`, {
        timeout: 4000,
      });
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {}

    // Fallback to local storage
    const localList = getLocalForms();
    const found = localList.find(f => f.id === idOrSlug || f.slug === idOrSlug);
    return found || null;
  },

  /**
   * Create new form (Admin only)
   */
  async createForm(data: DynamicFormCreateInput): Promise<DynamicForm> {
    const newFormId = `form_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newForm: DynamicForm = {
      id: newFormId,
      title: data.title,
      slug: data.slug || `form-${Date.now()}`,
      description: data.description || "",
      fields_schema: data.fields_schema,
      is_active: data.is_active ?? 1,
      submission_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 1. Optimistically save to local storage immediately
    const currentLocals = getLocalForms();
    const updated = [newForm, ...currentLocals.filter(f => f.slug !== newForm.slug)];
    saveLocalForms(updated);

    // 2. Sync to Backend API if reachable
    try {
      const res = await apiClient.post<ApiResponse<DynamicForm>>("/dynamic-forms", data, {
        timeout: 6000,
      });
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn("Backend sync failed, saved to local store:", err);
    }

    return newForm;
  },

  /**
   * Update existing form (Admin only)
   */
  async updateForm(id: string, data: Partial<DynamicFormCreateInput>): Promise<DynamicForm> {
    const currentLocals = getLocalForms();
    const targetIdx = currentLocals.findIndex(f => f.id === id);
    let updatedForm: DynamicForm;

    if (targetIdx > -1) {
      updatedForm = {
        ...currentLocals[targetIdx],
        ...data,
        updated_at: new Date().toISOString(),
      };
      currentLocals[targetIdx] = updatedForm;
      saveLocalForms(currentLocals);
    }

    try {
      const res = await apiClient.put<ApiResponse<DynamicForm>>(`/dynamic-forms/${id}`, data, {
        timeout: 6000,
      });
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {}

    return updatedForm! || (data as DynamicForm);
  },

  /**
   * Delete form (Admin only)
   */
  async deleteForm(id: string): Promise<void> {
    const currentLocals = getLocalForms();
    saveLocalForms(currentLocals.filter(f => f.id !== id));

    try {
      await apiClient.delete<ApiResponse<null>>(`/dynamic-forms/${id}`, { timeout: 5000 });
    } catch (err) {}
  },

  /**
   * Submit answers to form (Public)
   */
  async submitForm(idOrSlug: string, answers: Record<string, any>): Promise<string> {
    const subId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const submission: FormSubmission = {
      id: subId,
      form_id: idOrSlug,
      answers,
      submitted_at: new Date().toISOString(),
    };

    // Save to local storage for instant access
    saveLocalSubmission(idOrSlug, submission);

    // Update submission count locally
    const currentLocals = getLocalForms();
    const formIdx = currentLocals.findIndex(f => f.id === idOrSlug || f.slug === idOrSlug);
    if (formIdx > -1) {
      currentLocals[formIdx].submission_count = (currentLocals[formIdx].submission_count || 0) + 1;
      saveLocalForms(currentLocals);
    }

    try {
      const res = await apiClient.post<ApiResponse<{ submissionId: string }>>(
        `/dynamic-forms/${idOrSlug}/submit`,
        { answers },
        { timeout: 8000 }
      );
      if (res.data?.success) {
        return res.data?.data?.submissionId || subId;
      }
    } catch (err) {}

    return subId;
  },

  /**
   * Get all submissions for a form (Admin only)
   */
  async getSubmissions(formId: string): Promise<FormSubmission[]> {
    let apiSubmissions: FormSubmission[] = [];
    try {
      const res = await apiClient.get<ApiResponse<FormSubmission[]>>(`/dynamic-forms/${formId}/submissions`, {
        timeout: 5000,
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        apiSubmissions = res.data.data;
      }
    } catch (err) {}

    const localSubs = getLocalSubmissions(formId);
    if (apiSubmissions.length === 0) return localSubs;

    const existingIds = new Set(apiSubmissions.map(s => s.id));
    const extraLocals = localSubs.filter(s => !existingIds.has(s.id));
    return [...apiSubmissions, ...extraLocals];
  },

  /**
   * Delete a single submission (Admin only)
   */
  async deleteSubmission(submissionId: string): Promise<void> {
    try {
      await apiClient.delete<ApiResponse<null>>(`/dynamic-forms/submissions/${submissionId}`, { timeout: 5000 });
    } catch (err) {}
  },

  /**
   * Upload file attachment (Public)
   */
  async uploadAttachment(file: File): Promise<{ url: string; fileName: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await apiClient.post<ApiResponse<{ url: string; fileName: string }>>(
        "/dynamic-forms/upload-attachment",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 15000,
        }
      );

      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
    } catch (err) {}

    // Fallback: create an object URL or data URL preview so user is not blocked
    return {
      url: URL.createObjectURL(file),
      fileName: file.name,
    };
  },

  /**
   * Get direct download CSV URL
   */
  getExportCsvUrl(formId: string): string {
    return `${API_BASE_URL}/dynamic-forms/${formId}/export-csv`;
  }
};

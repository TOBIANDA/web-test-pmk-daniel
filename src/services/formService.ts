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
    title: "Pendataan Mahasiswa Baru PMK Daniel FILKOM UB",
    slug: "pendataan-maba-2026",
    description: "Shalom Mahasiswa Baru FILKOM UB! Selamat datang di keluarga besar PMK Daniel. Silakan isi form ini untuk mempermudah komunikasi dan pendampingan kakak tingkat.",
    is_active: 1,
    submission_count: 0,
    created_at: new Date().toISOString(),
    fields_schema: [
      // Page 1: Identitas Diri
      { id: "nama_lengkap", label: "Nama Lengkap", type: "text", placeholder: "Contoh: Jonathan Christopher", required: true },
      { id: "nim", label: "NIM (Nomor Induk Mahasiswa)", type: "text", placeholder: "Contoh: 265150200111001", required: true, validation: { type: "number", errorMessage: "NIM harus berupa angka" } },
      { id: "program_studi", label: "Program Studi / Jurusan", type: "select", options: ["Teknik Informatika", "Sistem Informasi", "Teknologi Informasi", "Pendidikan Teknologi Informasi", "Teknik Komputer"], required: true },
      { id: "no_whatsapp", label: "Nomor WhatsApp Aktif", type: "text", placeholder: "081234567890", required: true, validation: { type: "phone", errorMessage: "Nomor WhatsApp tidak valid" } },
      { id: "foto_ktm", label: "Upload Foto Diri / KTM / Bukti Penerimaan", type: "file", helpText: "Format file: JPG, PNG, atau PDF (Maksimal 10MB)", required: false },

      // Page 2: Kelompok Tumbuh Bersama (KTB)
      {
        id: "sec_ktb",
        label: "Kelompok Tumbuh Bersama (KTB)",
        type: "section",
        required: false
      },
      {
        id: "pernah_ktb",
        label: "Apakah sebelumnya pernah mengikuti Kelompok Tumbuh Bersama (KTB)?",
        type: "radio",
        options: ["Pernah", "Tidak Pernah"],
        required: true
      },
      {
        id: "ketertarikan_ktb",
        label: "Seberapa tertarik kamu untuk mengikuti Kelompok Tumbuh Bersama (KTB) di PMK Daniel?",
        type: "radio",
        helpText: "Tidak perlu khawatir kalau masih belum tahu banyak tentang KTB. Jawab sesuai ketertarikanmu saat ini saja ya!",
        options: ["Sangat Tertarik", "Tertarik", "Biasa Saja", "Tidak Tertarik"],
        required: true
      },
      {
        id: "minat_musik_awal",
        label: "Apakah kamu memiliki minat atau kemampuan di bidang musik?",
        type: "radio",
        helpText: "Siapa tahu talentamu bisa berkembang dan dipakai bersama di PMK Daniel! 🎵",
        options: ["Ya, suka banget", "Tidak"],
        required: true
      },

      // Page 3: Musik & Kamu (Opsional)
      {
        id: "sec_musik",
        label: "Musik & Kamu 🎵",
        type: "section",
        helpText: "Ceritakan dikit dong tentang minat musik kamu🤩",
        required: false
      },
      {
        id: "keahlian_musik",
        label: "Keahlian musik apa yang dapat atau biasa kamu ambil?",
        type: "checkbox",
        options: [
          "Gitar",
          "Piano",
          "Bass",
          "Drum",
          "Cajon",
          "Organ",
          "Biola",
          "Saxophone",
          "Lainnya"
        ],
        required: false
      },

      // Page 4: Olahraga & Kamu
      {
        id: "sec_olahraga",
        label: "Olahraga & Kamu 🏸",
        type: "section",
        helpText: "Punya olahraga favorit? Siapa tahu nanti bisa olahraga bareng! 🍻",
        required: false
      },
      {
        id: "minat_olahraga",
        label: "Olahraga apa yang kamu minati atau biasa kamu lakukan?",
        type: "checkbox",
        options: [
          "Badminton",
          "Futsal",
          "Basket",
          "Voli",
          "Renang",
          "Lari",
          "Catur",
          "Tenis Meja",
          "Sepeda",
          "Gym",
          "Baseball",
          "Taekwondo",
          "Lainnya"
        ],
        required: true
      },

      // Page 5: Wadah Talenta
      {
        id: "sec_wadah_talenta",
        label: "Wadah Talenta ✨",
        type: "section",
        helpText: "Wadah Talenta adalah ruang untuk mengembangkan kemampuan, berkarya, dan menggunakan talenta bersama dalam pelayanan PMK Daniel. ✨\n\nYuk, temukan ruang untuk mengembangkan talentamu bersama PMK Daniel!",
        required: false
      },
      {
        id: "tertarik_pelayanan",
        label: "Apakah kamu tertarik untuk terlibat dalam pelayanan di PMK Daniel?",
        type: "radio",
        options: ["Iya, tertarik", "Masih mempertimbangkan", "Belum tertarik"],
        required: true
      },

      // Page 6: Rumah Rohani & Gereja
      {
        id: "sec_rumah_rohani",
        label: "Rumah Rohani & Gereja ⛪",
        type: "section",
        helpText: "Kami ingin mengenal sedikit tentang gereja asalmu dan apakah kamu sudah memiliki tempat beribadah selama berada di Malang.",
        required: false
      },
      {
        id: "gereja_asal",
        label: "Apa nama gereja asalmu?",
        type: "text",
        placeholder: "Contoh: HKBP Bandung, GKI Serpong, GBI Makassar, dan sebagainya.",
        helpText: "Contoh: HKBP Bandung, GKI Serpong, GBI Makassar, dan sebagainya.",
        required: true
      },
      {
        id: "gereja_malang",
        label: "Apa nama gereja kamu selama berada di Malang?",
        type: "text",
        placeholder: "Contoh: GKI Bromo, HKBP Malang, GBI Suropati, dan sebagainya.",
        helpText: "Contoh: GKI Bromo, HKBP Malang, GBI Suropati, dan sebagainya.",
        required: true
      },

      // Page 7: Penutup & Link Grup WhatsApp
      {
        id: "sec_penutup",
        label: "Makasih udah isi formulirnya teman-teman 👋",
        type: "section",
        helpText: "Selamat datang di keluarga Mahasiswa Kristen Universitas Brawijaya. Jangan lupa gabung ke grup ini yaa..\n\nhttps://chat.whatsapp.com/DIIWjYChs4mKiMHomkw95r?s=cl&p=a&ilr=4\n\nTuhan memberkati perjalanan studimu. Sampai bertemu di PMK Daniel! 🙌",
        required: false
      }
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

    if (apiForms.length > 0) {
      saveLocalForms(apiForms);
      return activeOnly ? apiForms.filter((f) => f.is_active === 1) : apiForms;
    }

    const localForms = getLocalForms();
    return activeOnly ? localForms.filter((f) => f.is_active === 1) : localForms;
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
  async deleteSubmission(submissionId: string, formId?: string): Promise<void> {
    // 1. Clean from localStorage
    if (typeof window !== "undefined") {
      try {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(LOCAL_STORAGE_SUBMISSIONS_KEY));
        keys.forEach(k => {
          const raw = localStorage.getItem(k);
          if (raw) {
            const list: FormSubmission[] = JSON.parse(raw);
            const filtered = list.filter(s => s.id !== submissionId);
            localStorage.setItem(k, JSON.stringify(filtered));
          }
        });

        if (formId) {
          const locals = getLocalForms();
          const fIdx = locals.findIndex(f => f.id === formId || f.slug === formId);
          if (fIdx > -1) {
            locals[fIdx].submission_count = Math.max((locals[fIdx].submission_count || 1) - 1, 0);
            saveLocalForms(locals);
          }
        }
      } catch (e) {}
    }

    // 2. Call Backend API
    const res = await apiClient.delete<ApiResponse<null>>(`/dynamic-forms/submissions/${submissionId}`, { timeout: 6000 });
    if (!res.data?.success && res.data?.message) {
      throw new Error(res.data.message);
    }
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

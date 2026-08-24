export type FormFieldType = 
  | "text" 
  | "textarea" 
  | "radio" 
  | "checkbox" 
  | "select" 
  | "file" 
  | "date";

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  helpText?: string;
}

export interface DynamicForm {
  id: string;
  title: string;
  slug: string;
  description?: string;
  fields_schema: FormField[];
  is_active: number;
  submission_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DynamicFormCreateInput {
  title: string;
  slug?: string;
  description?: string;
  fields_schema: FormField[];
  is_active?: number;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  answers: Record<string, any>;
  submitted_at: string;
}

export interface FormSubmissionPayload {
  answers: Record<string, any>;
}

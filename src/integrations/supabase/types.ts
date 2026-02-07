export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      circulars: {
        Row: {
          body: string
          created_at: string | null
          created_by: string
          creator_role: Database["public"]["Enums"]["app_role"]
          id: string
          is_approved: boolean | null
          pdf_url: string | null
          show_to_students: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          created_by: string
          creator_role: Database["public"]["Enums"]["app_role"]
          id?: string
          is_approved?: boolean | null
          pdf_url?: string | null
          show_to_students?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          created_by?: string
          creator_role?: Database["public"]["Enums"]["app_role"]
          id?: string
          is_approved?: boolean | null
          pdf_url?: string | null
          show_to_students?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      exams: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          date: string
          department: string
          id: string
          subject: string
          time: string
          type: Database["public"]["Enums"]["exam_type"]
          venue: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          date: string
          department: string
          id?: string
          subject: string
          time: string
          type: Database["public"]["Enums"]["exam_type"]
          venue?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          department?: string
          id?: string
          subject?: string
          time?: string
          type?: Database["public"]["Enums"]["exam_type"]
          venue?: string | null
        }
        Relationships: []
      }
      hall_allocations: {
        Row: {
          capacity: number | null
          created_at: string | null
          exam_id: string | null
          hall_name: string
          id: string
          invigilator_id: string | null
          students: string[] | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          exam_id?: string | null
          hall_name: string
          id?: string
          invigilator_id?: string | null
          students?: string[] | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          exam_id?: string | null
          hall_name?: string
          id?: string
          invigilator_id?: string | null
          students?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "hall_allocations_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      invigilation_duties: {
        Row: {
          co_invigilator_id: string | null
          co_invigilator_name: string | null
          created_at: string | null
          date: string
          exam_id: string | null
          faculty_id: string
          faculty_name: string
          id: string
          shift: string
          status: string | null
          venue: string
        }
        Insert: {
          co_invigilator_id?: string | null
          co_invigilator_name?: string | null
          created_at?: string | null
          date: string
          exam_id?: string | null
          faculty_id: string
          faculty_name: string
          id?: string
          shift: string
          status?: string | null
          venue: string
        }
        Update: {
          co_invigilator_id?: string | null
          co_invigilator_name?: string | null
          created_at?: string | null
          date?: string
          exam_id?: string | null
          faculty_id?: string
          faculty_name?: string
          id?: string
          shift?: string
          status?: string | null
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "invigilation_duties_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      invigilation_exchanges: {
        Row: {
          created_at: string | null
          duty_id: string | null
          id: string
          reason: string | null
          requester_id: string
          requester_name: string
          responded_at: string | null
          status: string | null
          target_faculty_id: string
          target_faculty_name: string
        }
        Insert: {
          created_at?: string | null
          duty_id?: string | null
          id?: string
          reason?: string | null
          requester_id: string
          requester_name: string
          responded_at?: string | null
          status?: string | null
          target_faculty_id: string
          target_faculty_name: string
        }
        Update: {
          created_at?: string | null
          duty_id?: string | null
          id?: string
          reason?: string | null
          requester_id?: string
          requester_name?: string
          responded_at?: string | null
          status?: string | null
          target_faculty_id?: string
          target_faculty_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "invigilation_exchanges_duty_id_fkey"
            columns: ["duty_id"]
            isOneToOne: false
            referencedRelation: "invigilation_duties"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          email_sent: boolean | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_sent?: boolean | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_sent?: boolean | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      paper_settings: {
        Row: {
          created_at: string | null
          deadline: string
          exam_id: string | null
          faculty_id: string
          file_url: string | null
          id: string
          remarks: string | null
          status: Database["public"]["Enums"]["paper_status"] | null
          uploaded_at: string | null
        }
        Insert: {
          created_at?: string | null
          deadline: string
          exam_id?: string | null
          faculty_id: string
          file_url?: string | null
          id?: string
          remarks?: string | null
          status?: Database["public"]["Enums"]["paper_status"] | null
          uploaded_at?: string | null
        }
        Update: {
          created_at?: string | null
          deadline?: string
          exam_id?: string | null
          faculty_id?: string
          file_url?: string | null
          id?: string
          remarks?: string | null
          status?: Database["public"]["Enums"]["paper_status"] | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paper_settings_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_notifications: {
        Row: {
          content: Json
          created_at: string | null
          created_by: string
          id: string
          notification_type: string
          parent_email: string
          pdf_url: string | null
          sent_at: string | null
          status: string | null
          student_id: string
          student_name: string
          student_roll_no: string
        }
        Insert: {
          content: Json
          created_at?: string | null
          created_by: string
          id?: string
          notification_type: string
          parent_email: string
          pdf_url?: string | null
          sent_at?: string | null
          status?: string | null
          student_id: string
          student_name: string
          student_roll_no: string
        }
        Update: {
          content?: Json
          created_at?: string | null
          created_by?: string
          id?: string
          notification_type?: string
          parent_email?: string
          pdf_url?: string | null
          sent_at?: string | null
          status?: string | null
          student_id?: string
          student_name?: string
          student_roll_no?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string
          emp_id: string | null
          id: string
          name: string
          phone: string | null
          roll_no: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          emp_id?: string | null
          id: string
          name: string
          phone?: string | null
          roll_no?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          emp_id?: string | null
          id?: string
          name?: string
          phone?: string | null
          roll_no?: string | null
        }
        Relationships: []
      }
      results: {
        Row: {
          created_at: string | null
          entered_by: string | null
          exam_type: string
          grade: string | null
          id: string
          is_pass: boolean | null
          max_marks: number
          obtained_marks: number
          semester: number
          student_id: string
          student_name: string
          student_roll_no: string
          subject_code: string
          subject_name: string
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          entered_by?: string | null
          exam_type: string
          grade?: string | null
          id?: string
          is_pass?: boolean | null
          max_marks?: number
          obtained_marks: number
          semester: number
          student_id: string
          student_name: string
          student_roll_no: string
          subject_code: string
          subject_name: string
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          entered_by?: string | null
          exam_type?: string
          grade?: string | null
          id?: string
          is_pass?: boolean | null
          max_marks?: number
          obtained_marks?: number
          semester?: number
          student_id?: string
          student_name?: string
          student_roll_no?: string
          subject_code?: string
          subject_name?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      scrutiny_assignments: {
        Row: {
          created_at: string | null
          deadline: string
          id: string
          paper_setting_id: string | null
          remarks: string | null
          reviewed_at: string | null
          scrutinizer_id: string
          status: Database["public"]["Enums"]["paper_status"] | null
        }
        Insert: {
          created_at?: string | null
          deadline: string
          id?: string
          paper_setting_id?: string | null
          remarks?: string | null
          reviewed_at?: string | null
          scrutinizer_id: string
          status?: Database["public"]["Enums"]["paper_status"] | null
        }
        Update: {
          created_at?: string | null
          deadline?: string
          id?: string
          paper_setting_id?: string | null
          remarks?: string | null
          reviewed_at?: string | null
          scrutinizer_id?: string
          status?: Database["public"]["Enums"]["paper_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "scrutiny_assignments_paper_setting_id_fkey"
            columns: ["paper_setting_id"]
            isOneToOne: false
            referencedRelation: "paper_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      syllabus: {
        Row: {
          created_at: string | null
          created_by: string | null
          credits: number
          department: string
          id: string
          is_published: boolean | null
          pdf_url: string | null
          semester: number
          subject_code: string
          subject_name: string
          units: Json
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          credits?: number
          department: string
          id?: string
          is_published?: boolean | null
          pdf_url?: string | null
          semester: number
          subject_code: string
          subject_name: string
          units?: Json
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          credits?: number
          department?: string
          id?: string
          is_published?: boolean | null
          pdf_url?: string | null
          semester?: number
          subject_code?: string
          subject_name?: string
          units?: Json
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      timetables: {
        Row: {
          created_at: string | null
          day_of_week: number
          department: string
          faculty_id: string | null
          faculty_name: string | null
          id: string
          room: string | null
          semester: number
          slot_number: number
          subject_code: string
          subject_name: string
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          department: string
          faculty_id?: string | null
          faculty_name?: string | null
          id?: string
          room?: string | null
          semester: number
          slot_number: number
          subject_code: string
          subject_name: string
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          department?: string
          faculty_id?: string | null
          faculty_name?: string | null
          id?: string
          room?: string | null
          semester?: number
          slot_number?: number
          subject_code?: string
          subject_name?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "faculty" | "student"
      exam_type: "CAT-1" | "CAT-2" | "Semester" | "Lab"
      paper_status:
        | "pending"
        | "uploaded"
        | "under_scrutiny"
        | "approved"
        | "needs_correction"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "faculty", "student"],
      exam_type: ["CAT-1", "CAT-2", "Semester", "Lab"],
      paper_status: [
        "pending",
        "uploaded",
        "under_scrutiny",
        "approved",
        "needs_correction",
      ],
    },
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      course: {
        Row: {
          category: string | null;
          course_id: number;
          cover_image: string | null;
          created_at: string;
          description: string | null;
          instructor_id: string | null;
          is_published: boolean | null;
          title: string | null;
        };
        Insert: {
          category?: string | null;
          course_id?: number;
          cover_image?: string | null;
          created_at?: string;
          description?: string | null;
          instructor_id?: string | null;
          is_published?: boolean | null;
          title?: string | null;
        };
        Update: {
          category?: string | null;
          course_id?: number;
          cover_image?: string | null;
          created_at?: string;
          description?: string | null;
          instructor_id?: string | null;
          is_published?: boolean | null;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_course_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      enrollment: {
        Row: {
          course_id: number | null
          created_at: string
          enrollment_id: number
          user_id: string | null
        }
        Insert: {
          course_id?: number | null
          created_at?: string
          enrollment_id?: number
          user_id?: string | null
        }
        Update: {
          course_id?: number | null
          created_at?: string
          enrollment_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_enrollment_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "public_enrollment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      lesson: {
        Row: {
          content: string | null;
          content_type: string | null;
          created_at: string;
          description: string | null;
          index: number | null;
          lesson_id: number;
          module_id: number | null;
          title: string | null;
        };
        Insert: {
          content?: string | null;
          content_type?: string | null;
          created_at?: string;
          description?: string | null;
          index?: number | null;
          lesson_id?: number;
          module_id?: number | null;
          title?: string | null;
        };
        Update: {
          content?: string | null;
          content_type?: string | null;
          created_at?: string;
          description?: string | null;
          index?: number | null;
          lesson_id?: number;
          module_id?: number | null;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_lesson_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollment"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "public_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson"
            referencedColumns: ["lesson_id"]
          },
        ];
      };
      lesson_progress: {
        Row: {
          completed: boolean | null;
          created_at: string;
          enrollment_id: number | null;
          lesson_id: number | null;
          progress_id: number;
        };
        Insert: {
          completed?: boolean | null;
          created_at?: string;
          enrollment_id?: number | null;
          lesson_id?: number | null;
          progress_id?: number;
        };
        Update: {
          completed?: boolean | null;
          created_at?: string;
          enrollment_id?: number | null;
          lesson_id?: number | null;
          progress_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "public_lesson_progress_enrollment_id_fkey";
            columns: ["enrollment_id"];
            isOneToOne: false;
            referencedRelation: "enrollment";
            referencedColumns: ["enrollment_id"];
          },
          {
            foreignKeyName: "public_lesson_progress_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lesson";
            referencedColumns: ["lesson_id"];
          },
        ];
      };
      module: {
        Row: {
          course_id: number | null;
          created_at: string;
          description: string | null;
          index: number | null;
          module_id: number;
          title: string | null;
        };
        Insert: {
          course_id?: number | null;
          created_at?: string;
          description?: string | null;
          index?: number | null;
          module_id?: number;
          title?: string | null;
        };
        Update: {
          course_id?: number | null;
          created_at?: string;
          description?: string | null;
          index?: number | null;
          module_id?: number;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_module_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course"
            referencedColumns: ["course_id"]
          },
        ]
      }
      test: {
        Row: {
          created_at: string
          id: number
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          text: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          text?: string
          user_id?: string
        }
        Relationships: []
      }
      user: {
        Row: {
          created_at: string
          role_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          role_name?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      enroll_user_in_course_and_create_progress_records: {
        Args: {
          p_user_id: string;
          p_course_id: number;
        };
        Returns: undefined;
      };
      hello_world: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      requesting_user_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      testfunction: {
        Args: Record<PropertyKey, never>;
        Returns: {
          category: string | null;
          course_id: number;
          cover_image: string | null;
          created_at: string;
          description: string | null;
          instructor_id: string | null;
          is_published: boolean | null;
          title: string | null;
        }[];
      };
    };
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

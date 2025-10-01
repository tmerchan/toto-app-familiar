/*
  # Crear tablas principales de Toto

  ## 1. Nuevas Tablas

  ### users
  - `id` (uuid, primary key) - ID único del usuario
  - `auth_id` (uuid, unique) - ID de Supabase Auth
  - `email` (text, unique) - Email del usuario
  - `role` (text) - Rol: 'caregiver' o 'elderly'
  - `created_at` (timestamptz) - Fecha de creación
  - `updated_at` (timestamptz) - Fecha de actualización

  ### elderly_profiles
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Referencia a users
  - `name` (text) - Nombre completo
  - `birth_date` (date) - Fecha de nacimiento
  - `phone` (text) - Número de teléfono
  - `address` (text) - Dirección
  - `medical_info` (text) - Información médica relevante
  - `emergency_contact` (text) - Contacto de emergencia principal
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### caregiver_profiles
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Referencia a users
  - `name` (text) - Nombre completo
  - `phone` (text) - Número de teléfono
  - `elderly_id` (uuid, foreign key) - Referencia a elderly_profiles
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### trusted_contacts
  - `id` (uuid, primary key)
  - `elderly_id` (uuid, foreign key) - Referencia a elderly_profiles
  - `name` (text) - Nombre del contacto
  - `relationship` (text) - Relación (hijo/a, médico, etc.)
  - `phone` (text) - Número de teléfono
  - `whatsapp_enabled` (boolean) - Si tiene WhatsApp habilitado

  ### module_settings
  - Configuración de módulos activos para cada persona mayor
  - 4 módulos básicos siempre activos: registro, prevención, recordatorios, comunicación
  - 2 módulos opcionales: entretenimiento, asistente
  - Configuración de preferencias: notificaciones, sonidos, vibración

  ## 2. Seguridad
  - Habilitar RLS en todas las tablas
  - Las políticas se crearán en una migración separada
*/

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid UNIQUE,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('caregiver', 'elderly')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de perfiles de personas mayores
CREATE TABLE IF NOT EXISTS elderly_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  birth_date date,
  phone text,
  address text,
  medical_info text,
  emergency_contact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de perfiles de cuidadores
CREATE TABLE IF NOT EXISTS caregiver_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  elderly_id uuid REFERENCES elderly_profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de contactos de confianza
CREATE TABLE IF NOT EXISTS trusted_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  elderly_id uuid REFERENCES elderly_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  relationship text NOT NULL,
  phone text NOT NULL,
  whatsapp_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de configuración de módulos
CREATE TABLE IF NOT EXISTS module_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  elderly_id uuid UNIQUE REFERENCES elderly_profiles(id) ON DELETE CASCADE,
  registration_enabled boolean DEFAULT true,
  prevention_enabled boolean DEFAULT true,
  reminders_enabled boolean DEFAULT true,
  communication_enabled boolean DEFAULT true,
  entertainment_enabled boolean DEFAULT false,
  assistant_enabled boolean DEFAULT false,
  notifications_enabled boolean DEFAULT true,
  sounds_enabled boolean DEFAULT true,
  vibration_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de recordatorios
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  elderly_id uuid REFERENCES elderly_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('medication', 'appointment', 'activity')),
  scheduled_time time NOT NULL,
  frequency text NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'once')),
  days_of_week text[] DEFAULT ARRAY[]::text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de alertas de caídas
CREATE TABLE IF NOT EXISTS fall_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  elderly_id uuid REFERENCES elderly_profiles(id) ON DELETE CASCADE,
  detected_at timestamptz DEFAULT now(),
  confirmed boolean DEFAULT false,
  confidence_score numeric(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  alert_sent boolean DEFAULT false,
  response_time interval,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de logs de comunicación
CREATE TABLE IF NOT EXISTS communication_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  elderly_id uuid REFERENCES elderly_profiles(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES trusted_contacts(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('whatsapp', 'call', 'alert')),
  direction text NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  content text,
  sent_at timestamptz DEFAULT now(),
  delivered boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de interacciones con el asistente
CREATE TABLE IF NOT EXISTS assistant_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  elderly_id uuid REFERENCES elderly_profiles(id) ON DELETE CASCADE,
  query text NOT NULL,
  response text NOT NULL,
  intent text,
  success boolean DEFAULT true,
  interaction_time timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de sesiones de entretenimiento
CREATE TABLE IF NOT EXISTS entertainment_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  elderly_id uuid REFERENCES elderly_profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('music', 'game', 'video')),
  content_id text,
  duration interval,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_elderly_profiles_user_id ON elderly_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_caregiver_profiles_user_id ON caregiver_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_caregiver_profiles_elderly_id ON caregiver_profiles(elderly_id);
CREATE INDEX IF NOT EXISTS idx_trusted_contacts_elderly_id ON trusted_contacts(elderly_id);
CREATE INDEX IF NOT EXISTS idx_module_settings_elderly_id ON module_settings(elderly_id);
CREATE INDEX IF NOT EXISTS idx_reminders_elderly_id ON reminders(elderly_id);
CREATE INDEX IF NOT EXISTS idx_fall_alerts_elderly_id ON fall_alerts(elderly_id);
CREATE INDEX IF NOT EXISTS idx_communication_logs_elderly_id ON communication_logs(elderly_id);
CREATE INDEX IF NOT EXISTS idx_assistant_interactions_elderly_id ON assistant_interactions(elderly_id);
CREATE INDEX IF NOT EXISTS idx_entertainment_sessions_elderly_id ON entertainment_sessions(elderly_id);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para actualizar updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_elderly_profiles_updated_at') THEN
    CREATE TRIGGER update_elderly_profiles_updated_at
      BEFORE UPDATE ON elderly_profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_caregiver_profiles_updated_at') THEN
    CREATE TRIGGER update_caregiver_profiles_updated_at
      BEFORE UPDATE ON caregiver_profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_trusted_contacts_updated_at') THEN
    CREATE TRIGGER update_trusted_contacts_updated_at
      BEFORE UPDATE ON trusted_contacts
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_module_settings_updated_at') THEN
    CREATE TRIGGER update_module_settings_updated_at
      BEFORE UPDATE ON module_settings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_reminders_updated_at') THEN
    CREATE TRIGGER update_reminders_updated_at
      BEFORE UPDATE ON reminders
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
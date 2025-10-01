/*
  # Crear políticas de Row Level Security (RLS)

  ## Seguridad

  Habilitar RLS y crear políticas para todas las tablas:
  
  1. **users** - Los usuarios pueden ver y actualizar solo sus propios datos
  2. **elderly_profiles** - Personas mayores y cuidadores asignados pueden acceder
  3. **caregiver_profiles** - Cuidadores pueden ver y actualizar su propio perfil
  4. **trusted_contacts** - Accesibles por la persona mayor y sus cuidadores
  5. **module_settings** - Gestionadas por cuidadores
  6. **reminders** - Gestionados por cuidadores, visibles para persona mayor
  7. **fall_alerts** - Visibles para persona mayor y cuidadores
  8. **communication_logs** - Visibles para persona mayor y cuidadores
  9. **assistant_interactions** - Visibles para persona mayor y cuidadores
  10. **entertainment_sessions** - Visibles para persona mayor y cuidadores
*/

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE elderly_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE fall_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE entertainment_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_id)
  WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_id);

-- Políticas para elderly_profiles
CREATE POLICY "Elderly can read own profile"
  ON elderly_profiles FOR SELECT
  TO authenticated
  USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Caregivers can read assigned elderly profiles"
  ON elderly_profiles FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "Caregivers can insert elderly profiles"
  ON elderly_profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Elderly and caregivers can update profiles"
  ON elderly_profiles FOR UPDATE
  TO authenticated
  USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  )
  WITH CHECK (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

-- Políticas para caregiver_profiles
CREATE POLICY "Caregivers can read own profile"
  ON caregiver_profiles FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Caregivers can insert own profile"
  ON caregiver_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Caregivers can update own profile"
  ON caregiver_profiles FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Políticas para trusted_contacts
CREATE POLICY "Authorized users can read contacts"
  ON trusted_contacts FOR SELECT
  TO authenticated
  USING (
    elderly_id IN (
      SELECT id FROM elderly_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
    OR elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "Caregivers can insert contacts"
  ON trusted_contacts FOR INSERT
  TO authenticated
  WITH CHECK (
    elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "Caregivers can update contacts"
  ON trusted_contacts FOR UPDATE
  TO authenticated
  USING (
    elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  )
  WITH CHECK (
    elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "Caregivers can delete contacts"
  ON trusted_contacts FOR DELETE
  TO authenticated
  USING (
    elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

-- Políticas para module_settings
CREATE POLICY "Authorized users can read module settings"
  ON module_settings FOR SELECT
  TO authenticated
  USING (
    elderly_id IN (
      SELECT id FROM elderly_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
    OR elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "Caregivers can insert module settings"
  ON module_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "Caregivers can update module settings"
  ON module_settings FOR UPDATE
  TO authenticated
  USING (
    elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  )
  WITH CHECK (
    elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

-- Políticas para reminders
CREATE POLICY "Authorized users can read reminders"
  ON reminders FOR SELECT
  TO authenticated
  USING (
    elderly_id IN (
      SELECT id FROM elderly_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
    OR elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "Caregivers can insert reminders"
  ON reminders FOR INSERT
  TO authenticated
  WITH CHECK (
    elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "Caregivers can update reminders"
  ON reminders FOR UPDATE
  TO authenticated
  USING (
    elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  )
  WITH CHECK (
    elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "Caregivers can delete reminders"
  ON reminders FOR DELETE
  TO authenticated
  USING (
    elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

-- Políticas para fall_alerts
CREATE POLICY "Authorized users can read fall alerts"
  ON fall_alerts FOR SELECT
  TO authenticated
  USING (
    elderly_id IN (
      SELECT id FROM elderly_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
    OR elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "System can insert fall alerts"
  ON fall_alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authorized users can update fall alerts"
  ON fall_alerts FOR UPDATE
  TO authenticated
  USING (
    elderly_id IN (
      SELECT id FROM elderly_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
    OR elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  )
  WITH CHECK (
    elderly_id IN (
      SELECT id FROM elderly_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
    OR elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

-- Políticas para communication_logs
CREATE POLICY "Authorized users can read communication logs"
  ON communication_logs FOR SELECT
  TO authenticated
  USING (
    elderly_id IN (
      SELECT id FROM elderly_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
    OR elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "System can insert communication logs"
  ON communication_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas para assistant_interactions
CREATE POLICY "Authorized users can read assistant interactions"
  ON assistant_interactions FOR SELECT
  TO authenticated
  USING (
    elderly_id IN (
      SELECT id FROM elderly_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
    OR elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "System can insert assistant interactions"
  ON assistant_interactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas para entertainment_sessions
CREATE POLICY "Authorized users can read entertainment sessions"
  ON entertainment_sessions FOR SELECT
  TO authenticated
  USING (
    elderly_id IN (
      SELECT id FROM elderly_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
    OR elderly_id IN (
      SELECT elderly_id FROM caregiver_profiles
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "System can insert entertainment sessions"
  ON entertainment_sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update entertainment sessions"
  ON entertainment_sessions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
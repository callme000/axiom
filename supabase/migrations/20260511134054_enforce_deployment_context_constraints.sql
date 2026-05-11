ALTER TABLE public.deployments
  ADD COLUMN IF NOT EXISTS advanced_context JSONB DEFAULT '{}'::jsonb;

UPDATE public.deployments
SET advanced_context = '{}'::jsonb
WHERE advanced_context IS NULL;

ALTER TABLE public.deployments
  ALTER COLUMN category DROP DEFAULT,
  ALTER COLUMN advanced_context SET DEFAULT '{}'::jsonb,
  ALTER COLUMN advanced_context SET NOT NULL;

ALTER TABLE public.deployments
  DROP CONSTRAINT IF EXISTS deployments_category_valid_check;

ALTER TABLE public.deployments
  ADD CONSTRAINT deployments_category_valid_check
  CHECK (
    category IS NOT NULL
    AND category IN ('Asset', 'Skill', 'Leverage', 'Experience', 'Leakage')
  )
  NOT VALID;

ALTER TABLE public.deployments
  DROP CONSTRAINT IF EXISTS deployments_advanced_context_shape_check;

ALTER TABLE public.deployments
  ADD CONSTRAINT deployments_advanced_context_shape_check
  CHECK (
    jsonb_typeof(advanced_context) = 'object'
    AND (
      NOT advanced_context ? 'associatedAccount'
      OR jsonb_typeof(advanced_context -> 'associatedAccount') = 'string'
    )
    AND (
      NOT advanced_context ? 'expectedReturnHorizon'
      OR advanced_context ->> 'expectedReturnHorizon' IN (
        'short-term',
        'medium-term',
        'long-term'
      )
    )
    AND (
      NOT advanced_context ? 'tags'
      OR jsonb_typeof(advanced_context -> 'tags') = 'array'
    )
  )
  NOT VALID;

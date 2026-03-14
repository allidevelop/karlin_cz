/**
 * Utilities for merging CMS-managed content onto static i18n JSON messages.
 */

/**
 * Deep merge: overlay CMS values onto JSON defaults.
 * Only non-null, non-undefined, non-empty-string CMS values override.
 */
export function deepMerge(
  base: Record<string, any>,
  overlay: Record<string, any>,
): Record<string, any> {
  const result: Record<string, any> = { ...base }

  for (const key of Object.keys(overlay)) {
    const overlayVal = overlay[key]

    // Skip null, undefined, and empty strings
    if (overlayVal === null || overlayVal === undefined || overlayVal === '') {
      continue
    }

    const baseVal = result[key]

    // If both sides are plain objects, recurse
    if (
      typeof baseVal === 'object' &&
      baseVal !== null &&
      !Array.isArray(baseVal) &&
      typeof overlayVal === 'object' &&
      overlayVal !== null &&
      !Array.isArray(overlayVal)
    ) {
      result[key] = deepMerge(baseVal, overlayVal)
    } else {
      result[key] = overlayVal
    }
  }

  return result
}

/**
 * Set a value at a dot-separated path in a nested object, creating
 * intermediate objects as needed.
 *
 * Example: setNestedValue(obj, 'metadata.home.title', 'Hello')
 * → obj = { metadata: { home: { title: 'Hello' } } }
 */
function setNestedValue(obj: Record<string, any>, path: string, value: any): void {
  const parts = path.split('.')
  let current = obj

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (!(part in current) || typeof current[part] !== 'object' || current[part] === null) {
      current[part] = {}
    }
    current = current[part]
  }

  current[parts[parts.length - 1]] = value
}

/**
 * Convert a flat field map { fieldName: 'dot.path.key' } + CMS data object
 * into a nested object matching the JSON messages structure.
 * Only includes fields that have non-empty values.
 *
 * @param cmsData  - Flat object from Payload CMS (e.g., { homeTitle: 'Foo', homeDescription: '' })
 * @param fieldMap - Mapping of CMS field names to dot-paths (e.g., { homeTitle: 'metadata.title' })
 * @returns Nested object suitable for deepMerge with i18n messages
 *
 * @example
 * ```ts
 * const cmsData = { stepsVehicleLabel: 'Výběr vozidla', programTitle: '' }
 * const fieldMap = {
 *   stepsVehicleLabel: 'booking.steps.vehicle.label',
 *   programTitle: 'booking.program.title',
 * }
 * const result = mapFieldsToMessages(cmsData, fieldMap)
 * // → { booking: { steps: { vehicle: { label: 'Výběr vozidla' } } } }
 * // programTitle is empty, so not included
 * ```
 */
export function mapFieldsToMessages(
  cmsData: Record<string, any>,
  fieldMap: Record<string, string>,
): Record<string, any> {
  const result: Record<string, any> = {}

  for (const [fieldName, dotPath] of Object.entries(fieldMap)) {
    const value = cmsData[fieldName]

    // Only include non-empty string values
    if (typeof value === 'string' && value.length > 0) {
      setNestedValue(result, dotPath, value)
    }
  }

  return result
}

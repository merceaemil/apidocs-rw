# Alignment Report: COMPLETE_DOCUMENTATION.md vs DOCUMENTATION.txt

## Summary

This report identifies discrepancies between `COMPLETE_DOCUMENTATION.md` and `DOCUMENTATION.txt` (the authoritative semantic model). Several Rwanda-specific fields and some standard fields are missing from `COMPLETE_DOCUMENTATION.md`.

## Critical Discrepancies

### 1. MD.01 Mine Site

**Missing Fields:**
- **`allowedTags`** (1..1, Integer) - **REQUIRED**
  - Business Term: "Allowed Tags" / "Allowed Number of Tags"
  - Description: Approved Tags (list of tag numbers)
  - **Rwanda-specific**: Allocates a list of tag numbers to each mine site (from DMTS system)
  - Location in DOCUMENTATION.txt: Lines 292-302

- **`minesLocations`** (0..n, MD.06 Geolocalization) - **Optional but important**
  - Business Term: "Mine Locations"
  - Description: Geographic localization of individual mines within a mine site
  - **Rwanda-specific**: Allows tracking multiple mine locations within a mine site
  - Location in DOCUMENTATION.txt: Lines 228-235

**Cardinality Differences:**
- **`icglrId`**: 
  - DOCUMENTATION.txt: `0..1` (optional)
  - COMPLETE_DOCUMENTATION.md: Listed as "required"
  - **Issue**: Should be optional unless reporting to ICGLR

- **`nationalId`**:
  - DOCUMENTATION.txt: `0..1` (optional)
  - COMPLETE_DOCUMENTATION.md: Listed as "required"
  - **Issue**: Should be optional per semantic model

### 2. MD.04 Business Entity

**Missing Rwanda-Specific Fields:**
- **`rdbNumber`** (0..1, Identifier)
  - Business Term: "RDB number"
  - Description: Registration number from the Rwanda Development Board (RDB), if different from the tax ID number
  - Location in DOCUMENTATION.txt: Lines 657-664

- **`rcaNumber`** (0..1, Identifier)
  - Business Term: "RCA number"
  - Description: Registration number from the Rwanda Cooperative Agency (RCA), if applicable
  - Location in DOCUMENTATION.txt: Lines 665-672

- **`businessType`** (1..1, Identifier) - **REQUIRED**
  - Business Term: "Business Type"
  - Description: Takes value from the types defined by the Rwanda Development Board (RDB)
  - **Critical**: This is a required field (1..1), not optional
  - Location in DOCUMENTATION.txt: Lines 673-681

- **`otherInfo`** (0..1, String)
  - Business Term: "Other Info"
  - Description: Other identifying information if required
  - Location in DOCUMENTATION.txt: Lines 682-688

### 3. MD.11 Tag

**Missing Rwanda-Specific Fields:**
- **`representativeRMB`** (1..1, String) - **REQUIRED**
  - Business Term: "The representative of RMB"
  - Description: The representative of Rwanda Mines, Petroleum and Gas Board who approved, as name (string)
  - **Critical**: This is a required field (1..1)
  - Location in DOCUMENTATION.txt: Lines 1008-1012

- **`tagType`** (0..1, String)
  - Business Term: "Type of tag"
  - Description: The type of tag - numeric, QR code, etc
  - Location in DOCUMENTATION.txt: Lines 1013-1017

### 4. MD.12 Lot

**Missing Rwanda-Specific Fields:**
- **`miner`** (0..1, String) - **Conditionally REQUIRED**
  - Business Term: "Miner's name"
  - Description: The name of the miner who represented the team
  - **Critical Rule**: REQUIRED when the Originating operation is Production (1)
  - **Rwanda-specific**: Specific for Rwanda
  - Location in DOCUMENTATION.txt: Lines 1105-1111

- **`price`** (1..1) - **REQUIRED**
  - Business Term: "Price per UOM"
  - Description: Required in Rwanda as $/kg
  - **Critical**: This is a required field (1..1)
  - Location in DOCUMENTATION.txt: Lines 1123-1127

### 5. MD.07 Inspection

**Missing Field:**
- **`inspectionResponsible`** (1..1, String) - **REQUIRED**
  - Business Term: "Inspection responsible"
  - Description: The agency and person responsible for the inspection
  - **Critical**: This is a required field (1..1), not optional
  - Location in DOCUMENTATION.txt: Lines 837-841

**Note**: COMPLETE_DOCUMENTATION.md has `inspectorName` and `inspectorPosition` but is missing `inspectionResponsible` which is a separate field.

### 6. MD.05 Address

**Missing Field:**
- **`streetAddress`** (0..1, String/Street)
  - Business Term: "Street address"
  - Description: Street address information
  - Location in DOCUMENTATION.txt: Lines 779-785

## Additional Notes

### License Status Data Type
- **MD.02 License - `licenseStatus`**:
  - DOCUMENTATION.txt: `String` (line 356)
  - COMPLETE_DOCUMENTATION.md: `Integer` (line 971)
  - **Issue**: Data type mismatch - should be String per semantic model

### Contact Phone Number Cardinality
- **MD.09 Contact Details - `contactPhoneNumber`**:
  - DOCUMENTATION.txt: `1..n` (can have multiple phone numbers)
  - COMPLETE_DOCUMENTATION.md: Listed as single (implied `1..1`)
  - **Issue**: Should allow multiple phone numbers

## Impact Assessment

### High Priority (Required Fields Missing)
1. `businessType` in MD.04 Business Entity (1..1)
2. `representativeRMB` in MD.11 Tag (1..1)
3. `price` in MD.12 Lot (1..1)
4. `inspectionResponsible` in MD.07 Inspection (1..1)
5. `allowedTags` in MD.01 Mine Site (1..1)

### Medium Priority (Conditionally Required)
1. `miner` in MD.12 Lot (required when originatingOperation includes Production)

### Low Priority (Optional but Important)
1. `minesLocations` in MD.01 Mine Site
2. `rdbNumber`, `rcaNumber`, `otherInfo` in MD.04 Business Entity
3. `tagType` in MD.11 Tag
4. `streetAddress` in MD.05 Address

## Recommendations

1. **Update COMPLETE_DOCUMENTATION.md** to include all missing fields from DOCUMENTATION.txt
2. **Correct cardinality** for `icglrId` and `nationalId` in MD.01 Mine Site
3. **Fix data type** for `licenseStatus` in MD.02 License
4. **Update cardinality** for `contactPhoneNumber` in MD.09 Contact Details
5. **Add Rwanda-specific sections** or clearly mark Rwanda-specific fields throughout the documentation
6. **Ensure consistency** between the semantic model (DOCUMENTATION.txt) and the complete documentation

## Verification Checklist

- [ ] MD.01 Mine Site: Add `allowedTags` and `minesLocations`
- [ ] MD.01 Mine Site: Correct `icglrId` and `nationalId` cardinality
- [ ] MD.04 Business Entity: Add `rdbNumber`, `rcaNumber`, `businessType`, `otherInfo`
- [ ] MD.05 Address: Add `streetAddress`
- [ ] MD.07 Inspection: Add `inspectionResponsible`
- [ ] MD.09 Contact Details: Correct `contactPhoneNumber` cardinality to `1..n`
- [ ] MD.11 Tag: Add `representativeRMB` and `tagType`
- [ ] MD.12 Lot: Add `miner` and `price`
- [ ] MD.02 License: Correct `licenseStatus` data type to String

---

**Report Generated**: Based on comparison of DOCUMENTATION.txt (semantic model) and COMPLETE_DOCUMENTATION.md
**Version**: 2.3.0 - Rwanda Mineral Data Interoperability Standard

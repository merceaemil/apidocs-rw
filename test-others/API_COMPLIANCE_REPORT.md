# API Compliance Report: DMTS API vs Rwanda Mineral Data Interoperability Standard

**Generated:** February 3, 2026  
**Standard:** Rwanda Mineral Data Interoperability Standard API v2.3.0  
**Third-Party API:** Digital Mineral Traceability Solution (DMTS) API v1.0.0

---

## Executive Summary

### Overall Compatibility Assessment

**Compatibility Score: ~5-8% (Very Low)**

| Metric | Standard | Third-Party | Status |
|--------|----------|-------------|--------|
| **Primary Endpoints** | 8 | 248+ | ❌ 0% match |
| **Core Entity Schemas** | 3 (MD.01, MD.03, MD.12) | 0 | ❌ 0% match |
| **Supporting Schemas** | 16 | ~2 partial | ⚠️ ~12% match |
| **Rwanda-Specific Fields** | 9 | 1 partial | ⚠️ ~11% match |

### Key Findings

⚠️ **CRITICAL GAP**: The DMTS API requires **major restructuring** to comply with the Rwanda Mineral Data Interoperability Standard. The API has extensive functionality (248+ endpoints) but follows a different data model that does not align with the ICGLR-based standard.

**Primary Issues:**
1. **Missing Core Entities**: No MineSite, ExportCertificate, or Lot entities
2. **Different Data Model**: Uses internal IDs and structures instead of ICGLR standard format
3. **Missing Rwanda Extensions**: Most Rwanda-specific fields are absent
4. **No Chain of Custody**: Critical CoC tracking (Lot entity) is completely missing

---

## 1. Endpoint Analysis

### 1.1 Missing Required Endpoints

The following endpoints are **mandatory** in the Rwanda Standard but are **completely missing** in DMTS:

| Standard Endpoint | Purpose | Priority | DMTS Equivalent |
|-------------------|---------|----------|-----------------|
| `/mine-sites` | List/create mine sites | **CRITICAL** | `/api/sites` (conceptually similar) |
| `/mine-sites/{icglrId}` | Get/update mine site by ICGLR ID | **CRITICAL** | `/api/sites/{id}` (different ID format) |
| `/export-certificates` | List/create export certificates | **CRITICAL** | ❌ None found |
| `/export-certificates/{identifier}` | Get export certificate | **CRITICAL** | ❌ None found |
| `/lots` | List/create Chain of Custody lots | **CRITICAL** | ❌ None found |
| `/lots/{lotNumber}` | Get lot by number | **CRITICAL** | ❌ None found |
| `/graphql` | GraphQL query endpoint | Recommended | ❌ None found |
| `/health` | Health check | Recommended | ❌ None found |

### 1.2 Semantic Endpoint Mapping

Based on semantic analysis, the following DMTS endpoints may serve similar purposes but require significant modifications:

#### `/api/sites` → `/mine-sites` (Conceptual Match: ~30-40%)

**Similarities:**
- Both manage mining site data
- Both support GET (list) and POST (create) operations
- Both have pagination support

**Required Changes:**
1. **ID Format**: Change from internal UUID to ICGLR format (`CC-[Lat]-[Long]-NNNNN`)
2. **Query Parameters**: Add standard filters:
   - `addressCountry` (ICGLR member state code)
   - `certificationStatus` (0=Blue, 1=Green, 2=Yellow, 3=Red)
   - `activityStatus` (0=Abandoned, 1=Active, 2=Non-active)
   - `mineral` (HS Code filter)
3. **Response Format**: Use `MineSiteListResponse` with pagination metadata
4. **Data Structure**: Transform `CreateSiteDto` to `MineSite` schema

#### `/api/sites/{id}` → `/mine-sites/{icglrId}` (Conceptual Match: ~20-30%)

**Required Changes:**
1. **Path Parameter**: Change from UUID to ICGLR ID format
2. **Response**: Return full `MineSite` object with all nested entities
3. **PUT Method**: Support full `MineSite` update

### 1.3 Completely Missing Endpoints

**Chain of Custody (Lots) - CRITICAL:**
- `/lots` - **MUST BE CREATED** - No equivalent exists
- `/lots/{lotNumber}` - **MUST BE CREATED** - No equivalent exists

**Export Certificates - CRITICAL:**
- `/export-certificates` - **MUST BE CREATED** - No equivalent exists
- `/export-certificates/{identifier}` - **MUST BE CREATED** - No equivalent exists

These are **primary entities** in the standard and are essential for ICGLR compliance.

---

## 2. Schema/Entity Analysis

### 2.1 Primary Entities (MD.01, MD.03, MD.12)

#### MD.01 Mine Site - **COMPLETELY MISSING**

**Status:** ❌ **Not Found** - The entire MineSite entity is missing from DMTS schemas.

**What DMTS Has Instead:**
- `CreateSiteDto` - Basic site creation with: `code`, `name`, `companyId`, `licenseId`, `latitude`, `longitude`, `villageId`
- `UpdateSiteDto` - Site updates with: `name`, `status`, `inspected`, `allowedTags`, coordinates, `villageId`, `licenseId`

**Required MineSite Attributes (All Missing):**

| Attribute | Type | Required | Description | DMTS Status |
|-----------|------|----------|-------------|-------------|
| `icglrId` | string (pattern) | ✅ Yes | ICGLR ID format: `CC-[Lat]-[Long]-NNNNN` | ❌ Missing |
| `addressCountry` | ICGLRMemberState | ✅ Yes | ISO 3166-1 alpha-2 (always RW) | ❌ Missing |
| `nationalId` | string | Optional | National identification number | ⚠️ Partial (`code` exists) |
| `certificationStatus` | integer (0-3) | ✅ Yes | 0=Blue, 1=Green, 2=Yellow, 3=Red | ⚠️ Partial (`inspected` boolean exists) |
| `activityStatus` | integer (0-2) | ✅ Yes | 0=Abandoned, 1=Active, 2=Non-active | ⚠️ Partial (`status` string exists) |
| `mineSiteLocation` | MineSiteLocation | ✅ Yes | Geographic location (MD.08) | ⚠️ Partial (has lat/long but not structured) |
| `minesLocations` | Geolocalization[] | Optional | **Rwanda-specific:** Multiple mine locations | ❌ Missing |
| `mineral` | string[] (HS Codes) | ✅ Yes | Array of mineral HS Codes | ❌ Missing |
| `license` | License[] | ✅ Yes | Array of licenses (MD.02) | ⚠️ Partial (has `licenseId` reference) |
| `owner` | BusinessEntity | ✅ Yes | Mine site owner (MD.04) | ⚠️ Partial (has `companyId` reference) |
| `operator` | BusinessEntity[] | Optional | Operators if different from owner | ❌ Missing |
| `inspection` | Inspection[] | Optional | Inspection history (MD.07) | ⚠️ Partial (has `inspected` boolean) |
| `statusChange` | StatusHistory[] | Optional | Certification status history (MD.10) | ❌ Missing |
| `allowedTags` | integer | ✅ Yes | **Rwanda-specific:** Allowed number of tags | ✅ **EXISTS** |

**Key Gaps:**
1. No ICGLR ID format support
2. No structured location object (MineSiteLocation)
3. No mineral codes (HS Codes)
4. No proper License entity (only ID reference)
5. No BusinessEntity structure (only ID reference)
6. No Inspection entity (only boolean flag)
7. No certification/activity status codes (uses strings instead of integers)

#### MD.03 Export Certificate - **COMPLETELY MISSING**

**Status:** ❌ **Not Found** - No export certificate functionality exists.

**Required Attributes (All Missing):**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `issuingCountry` | ICGLRMemberState | ✅ Yes | ISO 3166-1 alpha-2 (always RW) |
| `identifier` | string | ✅ Yes | Unique serial number |
| `exporter` | BusinessEntity | ✅ Yes | Exporter business entity |
| `importer` | BusinessEntity | ✅ Yes | Importer business entity |
| `lotNumber` | string | ✅ Yes | Exporter's unique lot number |
| `typeOfOre` | string (HS Code) | ✅ Yes | Mineral code (MDC.03) |
| `lotWeight` | number (Decimal) | ✅ Yes | Lot weight |
| `lotWeightUOM` | string (enum) | ✅ Yes | Unit of measure (TNE or KGM) |
| `lotGrade` | string | ✅ Yes | Grade expression |
| `mineralOrigin` | string | ✅ Yes | Country codes (semicolon-separated, e.g., "CD;BI;RW") |
| `customsValue` | string/Decimal | ✅ Yes | Declared value in USD |
| `dateOfShipment` | date | ✅ Yes | Planned shipment date |
| `dateOfIssuance` | date | ✅ Yes | Certificate countersign date |
| `dateOfExpiration` | date | ✅ Yes | Expiration (max 90 days from issuance) |
| `certificateFile` | File | ✅ Yes | Certificate as file (PDF/PNG/JPEG) |
| `memberStateIssuingAuthority` | string | ✅ Yes | Issuing authority name |
| `nameOfVerifier` | string | ✅ Yes | Verifier's name |
| `positionOfVerifier` | string | ✅ Yes | Verifier's position |
| `dateOfVerification` | date | ✅ Yes | Verification date |
| `nameOfValidator` | string | ✅ Yes | Validator's name |
| `idOfVerifier` | string | Optional | Verifier's ID |
| `shipmentRoute` | string | Optional | ISO 3166 codes (semicolon-separated) |
| `transportCompany` | string | Optional | Transport company name |

**Impact:** This is a **CRITICAL** missing entity. Export certificates are mandatory for ICGLR compliance and international mineral trade.

#### MD.12 Lot (Chain of Custody) - **COMPLETELY MISSING**

**Status:** ❌ **Not Found** - No Chain of Custody tracking exists.

**Required Attributes (All Missing):**

| Attribute | Type | Required | Description | Notes |
|-----------|------|----------|-------------|-------|
| `lotNumber` | string | ✅ Yes | Lot number given by CoC actor | |
| `dateRegistration` | date | ✅ Yes | Date when registration was created | |
| `timeRegistration` | time (hhmmss) | ✅ Yes | Time when registration was created | |
| `creator` | BusinessEntity | ✅ Yes | Business entity that created the lot | |
| `mineral` | string (HS Code) | ✅ Yes | Contained mineral identifier | |
| `concentration` | number (Decimal) | ✅ Yes | Mineral concentration in percent | |
| `mass` | number (Decimal) | ✅ Yes | Lot weight | |
| `unitOfMeasurement` | string (enum) | ✅ Yes | Unit of measure (TNE or KGM) | |
| `mineSiteId` | string (ICGLR ID) | Conditional | **REQUIRED when originatingOperation includes Production** | |
| `miner` | string | Conditional | **Rwanda-specific:** REQUIRED when Production | |
| `creatorRole` | integer[] | ✅ Yes | CoC roles (1=Miner, 2=Trader, etc.) | |
| `price` | number | ✅ Yes | **Rwanda-specific:** Price per UOM ($/kg) | |
| `recipient` | BusinessEntity | Optional | Lot recipient | |
| `originatingOperation` | integer[] | ✅ Yes | Operations (1=Production, 2=Purchase, etc.) | |
| `inputLot` | Lot[] | Optional | Lots that form this lot (for transformations) | |
| `tag` | Tag | Conditional | **REQUIRED when originatingOperation includes Production** | |
| `taxPaid` | Tax[] | Optional | Taxes paid | |
| `dateSealed` | date | Optional | Date when lot is sealed | |
| `dateShipped` | date | Optional | Date when lot is shipped | |
| `purchaseNumber` | string | Optional | Purchase order number | |
| `purchaseDate` | date | Optional | Purchase date | |
| `responsibleStaff` | string | Optional | Name of responsible staff | |
| `dateIn` | date | Optional | Date received by processor | |
| `transportationMethod` | string | Optional | Transportation method | |
| `transportationRoute` | string | Optional | Transportation route | |
| `transportCompany` | string | Optional | Transport company | |
| `exportCertificateId` | string | Optional | ICGLR Certificate number if for export | |

**Impact:** This is a **CRITICAL** missing entity. Chain of Custody tracking is the core mechanism for ensuring conflict-free mineral sourcing and is mandatory for ICGLR compliance.

### 2.2 Secondary Entities

#### MD.04 BusinessEntity - **PARTIALLY EXISTS**

**DMTS Schema:** `CreateCompanyDto` / `UpdateCompanyDto`

**Similarity:** ~35-40% (conceptual match but structural differences)

**Field Mapping:**

| Standard Field | Type | Required | DMTS Field | Match | Notes |
|----------------|------|----------|------------|-------|-------|
| `identifier` | string | ✅ Yes | ❌ Missing | ❌ | Must be added |
| `name` | string | ✅ Yes | `name` | ✅ | Exists |
| `legalAddress` | Address (object) | Optional | `legalAddress` (string) | ⚠️ | Type mismatch - should be Address object |
| `physicalAddress` | Address (object) | Optional | `physicalAddress` (string) | ⚠️ | Type mismatch - should be Address object |
| `tin` | string | ✅ Yes | `tin` | ✅ | Exists |
| `rdbNumber` | string | Optional | ❌ Missing | ❌ | **Rwanda-specific** - Must be added |
| `rcaNumber` | string | Optional | ❌ Missing | ❌ | **Rwanda-specific** - Must be added |
| `businessType` | string | ✅ Yes | `businessType` | ✅ | Exists but may need validation |
| `otherInfo` | string | Optional | ❌ Missing | ❌ | Must be added |
| `contactDetails` | ContactDetails (object) | ✅ Yes | Flat fields | ⚠️ | Must be restructured into object |

**DMTS Extra Fields (Not in Standard):**
- `shortName` - Company short name
- `legalRepresentativeName` - Legal representative (should be in ContactDetails)
- `contactPhoneNumber` - Should be in ContactDetails object
- `contactEmail` - Should be in ContactDetails object
- `organisationType` - Organization type
- `selectedLicenses` - Array of license IDs

**Required Changes:**
1. Add `identifier` field (required)
2. Add `rdbNumber` and `rcaNumber` (Rwanda-specific)
3. Add `otherInfo` field
4. Restructure addresses: Convert string addresses to `Address` objects (MD.05)
5. Restructure contacts: Move `legalRepresentativeName`, `contactPhoneNumber`, `contactEmail` into `ContactDetails` object (MD.09)
6. Make `businessType` required and validate against RDB types

#### MD.05 Address - **MISSING**

**Status:** ❌ **Not Found** - Addresses are stored as strings in DMTS.

**Required Structure:**
- `country` (required) - ISO 3166-1 alpha-2 (always RW)
- `subnationalDivisionL1` - ISO 3166-2 code (RW-01 to RW-05)
- `subnationalDivisionL1Text` - Province name
- `subnationalDivisionL2` - District name
- `subnationalDivisionL3` - Sector name
- `subnationalDivisionL4` - Does not apply
- `addressLocalityText` (required) - Locality as free text
- `addressLocalityCode` - Locality code
- `streetAddress` - Street address

**Current DMTS:** Uses string fields `legalAddress` and `physicalAddress` - must be converted to structured Address objects.

#### MD.06 Geolocalization - **PARTIALLY EXISTS**

**Status:** ⚠️ **Partial** - Has coordinates but not structured.

**DMTS Current:** 
- `latitude` (number)
- `longitude` (number)

**Required Structure:**
- `lat` (required) - Latitude in WGS 84, decimal degrees with 4 decimals (-90 to 90)
- `long` (required) - Longitude in WGS 84, decimal degrees with 4 decimals (-180 to 180)

**Required Changes:**
1. Rename `latitude` → `lat`
2. Rename `longitude` → `long`
3. Add validation: 4 decimal precision, range validation
4. Structure as Geolocalization object (not flat fields)

#### MD.07 Inspection - **MISSING**

**Status:** ❌ **Not Found** - Only has boolean `inspected` flag.

**Required Structure:**
- `inspectionId` (required) - Generated identifier (e.g., "PS-2025-12-02-16-03")
- `inspectionDate` (required) - Date of inspection
- `inspectionResponsible` (required) - Agency and person responsible
- `inspectionResult` (required) - Certification status (0-3)
- `inspectionReport` (optional) - Full report file (max 8MB)
- `inspectionPurpose` (optional) - Inspection purpose
- `inspectionResults` (optional) - Inspection results (long text)
- `inspectorName` (required) - Full name
- `inspectorPosition` (required) - Title or position
- `governmentAgency` (required) - Government Agency
- `governmentId` (optional) - Government ID

**Current DMTS:** Only has `inspected: boolean` - needs complete Inspection entity.

#### MD.08 MineSiteLocation - **MISSING**

**Status:** ❌ **Not Found** - Location data is flat, not structured.

**Required Structure:**
- `geolocalization` (required) - Geolocalization object (MD.06)
- `nationalCadasterLocalization` (optional) - National cadaster code
- `localGeographicDesignation` (optional) - Address object (MD.05)
- `polygon` (optional) - GeoJSON Polygon
- `altitude` (optional) - Average altitude in meters

**Current DMTS:** Has `latitude`, `longitude`, `villageId` as flat fields - must be restructured.

#### MD.09 ContactDetails - **PARTIALLY EXISTS**

**Status:** ⚠️ **Partial** - Fields exist but as flat structure in CompanyDto.

**DMTS Current Fields:**
- `legalRepresentativeName` (string)
- `contactPhoneNumber` (string)
- `contactEmail` (string)

**Required Structure:**
- `legalRepresentative` (required) - First name and last name
- `contactPhoneNumber` (required, 1..n) - E.164 format, can have multiple
- `contactEmail` (required) - Email format

**Required Changes:**
1. Rename `legalRepresentativeName` → `legalRepresentative`
2. Move fields into `ContactDetails` object (nested in BusinessEntity)
3. Support multiple phone numbers (array)
4. Add E.164 format validation for phone numbers
5. Add email format validation

#### MD.02 License - **MISSING**

**Status:** ❌ **Not Found** - Only has `licenseId` reference.

**Required Structure:**
- `licenseType` (required) - Enum: claim, exploration_permit, mining_license, artisanal_permit, unlicensed, other
- `licenseId` (optional) - License identification number
- `owner` (optional) - BusinessEntity (MD.04)
- `appliedDate` (optional) - Date applied
- `grantedDate` (optional) - Date granted
- `expiringDate` (optional) - Date expiring
- `licenseStatus` (optional) - "0" or "1" (Active/Non-Active)
- `coveredCommodities` (required) - Array of mineral HS Codes

**Current DMTS:** Only has `licenseId` (string reference) - needs full License entity.

#### MD.10 StatusHistory - **MISSING**

**Status:** ❌ **Not Found**

**Required Structure:**
- `dateOfChange` (required) - Date of status change
- `newStatus` (required) - Certification status (0-3)

**Impact:** Cannot track certification status changes over time.

#### MD.11 Tag - **MISSING**

**Status:** ❌ **Not Found** - No tag entity exists.

**Required Structure:**
- `identifier` (required) - Unique ID (QR code, barcode, numeric)
- `issuer` (required) - BusinessEntity (MD.04)
- `issueDate` (required) - Date when tag was created
- `issueTime` (required) - Time when tag was created (hhmmss)
- `representativeRMB` (required) - **Rwanda-specific:** RMB representative who approved
- `tagType` (optional) - **Rwanda-specific:** Type of tag

**Impact:** Tags are required for Production lots in Chain of Custody.

#### MD.13 Tax - **MISSING**

**Status:** ❌ **Not Found**

**Required Structure:**
- `taxType` (required) - Textual description of tax type
- `taxAmount` (required) - Value of paid tax (Decimal)
- `currency` (required) - Currency code (ISO 4217, 3 letters)
- `taxAuthority` (optional) - Authority who imposed the tax
- `taxPaidDate` (optional) - Date when tax was paid
- `receiptReference` (optional) - Receipt number or reference

---

## 3. Rwanda-Specific Fields Analysis

### 3.1 Required Rwanda-Specific Fields

| Field | Entity | Required | Status | Notes |
|-------|--------|----------|--------|-------|
| `allowedTags` | MineSite | ✅ Yes | ✅ **EXISTS** | Found in `UpdateSiteDto` |
| `minesLocations` | MineSite | Optional | ❌ Missing | Multiple mine locations within site |
| `rdbNumber` | BusinessEntity | Optional | ❌ Missing | RDB registration number |
| `rcaNumber` | BusinessEntity | Optional | ❌ Missing | RCA registration number |
| `businessType` | BusinessEntity | ✅ Yes | ✅ **EXISTS** | Found in `CreateCompanyDto` |
| `representativeRMB` | Tag | ✅ Yes | ❌ Missing | Required for tag approval |
| `tagType` | Tag | Optional | ❌ Missing | Type of tag |
| `miner` | Lot | Conditional | ❌ Missing | Required when Production operation |
| `price` | Lot | ✅ Yes | ❌ Missing | Required as $/kg |

**Summary:** 2 of 9 Rwanda-specific fields exist (22%). 7 critical fields are missing.

---

## 4. Data Format and Code List Compliance

### 4.1 ID Format Issues

**Standard Requirement:**
- Mine Sites: ICGLR ID format `CC-[Lat]-[Long]-NNNNN` (e.g., `RW-1.9641+30.0619-00001`)
- Export Certificates: Serial number (unique in country, e.g., `RW2324A2`)
- Lots: Lot number given by CoC actor

**DMTS Current:**
- Sites: Uses internal UUIDs or custom `code` field (e.g., "ENK-1")
- No ICGLR ID format support

**Required Changes:**
1. Implement ICGLR ID generation algorithm
2. Add ICGLR ID validation pattern
3. Support both national ID and ICGLR ID

### 4.2 Status Code Issues

**Standard Requirement:**
- Certification Status: Integer codes (0=Blue, 1=Green, 2=Yellow, 3=Red)
- Activity Status: Integer codes (0=Abandoned, 1=Active, 2=Non-active)
- License Status: String "0" or "1" (Non-Active/Active)

**DMTS Current:**
- Site Status: String enum ("active", "inactive", "abandoned", "suspended")
- Inspected: Boolean flag

**Required Changes:**
1. Replace string status with integer codes
2. Add certification status field (separate from activity status)
3. Map existing status values to standard codes

### 4.3 Mineral Code Issues

**Standard Requirement:**
- Use HS Codes (Harmonized System) as primary
- Designated minerals: 7108.12.00 (Gold), 2609.00.00 (Cassiterite), 2611.00.00 (Wolframite), 2615.90.00 (Coltan)
- Support IMA Codes as alternative

**DMTS Current:**
- No mineral code fields found in site schemas

**Required Changes:**
1. Add `mineral` array field to site schema
2. Validate against HS Code list
3. Support multiple minerals per site

### 4.4 Date/Time Format Issues

**Standard Requirement:**
- Dates: ISO 8601 format (YYYY-MM-DD)
- Time: hhmmss format (e.g., "103000") or ISO 8601 extended time
- All dates must be date type (not date-time unless specified)

**DMTS Current:**
- Uses `date-time` format in some places
- No time field found (for lot registration time)

**Required Changes:**
1. Ensure all dates use `format: date` (not `date-time`)
2. Add time field support for lot registration
3. Validate ISO 8601 compliance

---

## 5. Required Changes Summary

### 5.1 Critical Changes (Must Have)

#### Endpoints
1. ✅ **Create `/mine-sites` endpoint** - Map from `/api/sites` with data transformation
2. ✅ **Create `/mine-sites/{icglrId}` endpoint** - Map from `/api/sites/{id}` with ID format change
3. ✅ **Create `/lots` endpoint** - **NEW** - No equivalent exists
4. ✅ **Create `/lots/{lotNumber}` endpoint** - **NEW** - No equivalent exists
5. ✅ **Create `/export-certificates` endpoint** - **NEW** - No equivalent exists
6. ✅ **Create `/export-certificates/{identifier}` endpoint** - **NEW** - No equivalent exists

#### Schemas
1. ✅ **Create `MineSite` schema** - Transform from `CreateSiteDto`/`UpdateSiteDto`
2. ✅ **Create `Lot` schema** - **NEW** - Complete Chain of Custody entity
3. ✅ **Create `ExportCertificate` schema** - **NEW** - Complete export certificate entity
4. ✅ **Create `License` schema** - Expand from `licenseId` reference
5. ✅ **Create `Inspection` schema** - Expand from `inspected` boolean
6. ✅ **Create `Address` schema** - Structure from string addresses
7. ✅ **Create `Geolocalization` schema** - Structure from lat/long fields
8. ✅ **Create `MineSiteLocation` schema** - Structure location data
9. ✅ **Create `ContactDetails` schema** - Structure from flat contact fields
10. ✅ **Create `Tag` schema** - **NEW** - For lot tagging
11. ✅ **Create `Tax` schema** - **NEW** - For tax payment tracking
12. ✅ **Create `StatusHistory` schema** - **NEW** - For status change tracking
13. ✅ **Update `BusinessEntity` schema** - Restructure from `CreateCompanyDto`

#### Fields
1. ✅ **Add ICGLR ID support** - Implement `icglrId` field with pattern validation
2. ✅ **Add certification status** - Integer code (0-3)
3. ✅ **Add activity status** - Integer code (0-2)
4. ✅ **Add mineral codes** - Array of HS Codes
5. ✅ **Add Rwanda-specific fields** - `rdbNumber`, `rcaNumber`, `representativeRMB`, `miner`, `price`
6. ✅ **Restructure addresses** - Convert strings to Address objects
7. ✅ **Restructure contacts** - Convert flat fields to ContactDetails object
8. ✅ **Add location structure** - Convert flat coordinates to MineSiteLocation

### 5.2 High Priority Changes

1. **ID Format Migration**
   - Implement ICGLR ID generation
   - Support both national ID and ICGLR ID
   - Add ID format validation

2. **Status Code Migration**
   - Convert string statuses to integer codes
   - Add certification status field
   - Map existing values to standard codes

3. **Data Structure Restructuring**
   - Convert flat structures to nested objects
   - Implement proper entity relationships
   - Add required field validations

4. **Rwanda Extensions**
   - Add all 7 missing Rwanda-specific fields
   - Implement business type validation against RDB types
   - Add RMB representative tracking

### 5.3 Medium Priority Changes

1. **Response Format Standardization**
   - Implement pagination metadata structure
   - Standardize error response format
   - Add list response wrappers

2. **Query Parameter Alignment**
   - Add standard filter parameters
   - Implement proper pagination
   - Add mineral code filtering

3. **Validation Enhancements**
   - Add pattern validations (ICGLR ID, phone, email)
   - Add enum validations (status codes, mineral codes)
   - Add range validations (coordinates, dates)

---

## 6. Migration Strategy

### Phase 1: Foundation (Weeks 1-4)

**Goal:** Establish core entity structures

1. **Create Core Schemas**
   - Implement `Address` schema (MD.05)
   - Implement `Geolocalization` schema (MD.06)
   - Implement `ContactDetails` schema (MD.09)
   - Implement `BusinessEntity` schema (MD.04) with Rwanda fields

2. **Create Supporting Schemas**
   - Implement `License` schema (MD.02)
   - Implement `Inspection` schema (MD.07)
   - Implement `StatusHistory` schema (MD.10)
   - Implement `Tag` schema (MD.11)
   - Implement `Tax` schema (MD.13)

3. **Update Existing Schemas**
   - Restructure `CreateCompanyDto` → `BusinessEntity`
   - Add Address objects to company schema
   - Add ContactDetails object to company schema

### Phase 2: Mine Site Implementation (Weeks 5-8)

**Goal:** Implement MD.01 Mine Site entity

1. **Create MineSite Schema**
   - Implement full `MineSite` schema with all required fields
   - Add ICGLR ID field with pattern validation
   - Add certification and activity status codes
   - Add mineral codes array
   - Add `MineSiteLocation` structure
   - Add `minesLocations` array (Rwanda-specific)
   - Add `allowedTags` field (already exists, verify)

2. **Create Mine Site Endpoints**
   - Implement `GET /mine-sites` with standard filters
   - Implement `POST /mine-sites` with MineSite schema
   - Implement `GET /mine-sites/{icglrId}` 
   - Implement `PUT /mine-sites/{icglrId}`

3. **Data Migration**
   - Create mapping from `CreateSiteDto` to `MineSite`
   - Implement ICGLR ID generation from coordinates
   - Map existing status values to integer codes
   - Add mineral codes to existing sites

### Phase 3: Chain of Custody (Weeks 9-12)

**Goal:** Implement MD.12 Lot entity (CRITICAL)

1. **Create Lot Schema**
   - Implement full `Lot` schema with all 25+ fields
   - Add conditional field logic (mineSiteId, tag, miner when Production)
   - Add Rwanda-specific fields (`miner`, `price`)
   - Add inputLot support for transformations

2. **Create Lot Endpoints**
   - Implement `GET /lots` with filtering
   - Implement `POST /lots` with Lot schema
   - Implement `GET /lots/{lotNumber}`

3. **Tag Integration**
   - Ensure Tag schema is implemented
   - Link tags to lots for Production operations
   - Add RMB representative tracking

### Phase 4: Export Certificates (Weeks 13-16)

**Goal:** Implement MD.03 Export Certificate entity (CRITICAL)

1. **Create ExportCertificate Schema**
   - Implement full schema with all 20+ fields
   - Add file upload support for certificate
   - Add date validation (expiration max 90 days)

2. **Create Export Certificate Endpoints**
   - Implement `GET /export-certificates` with filtering
   - Implement `POST /export-certificates`
   - Implement `GET /export-certificates/{identifier}`

3. **Integration**
   - Link export certificates to lots
   - Add certificate file storage
   - Implement certificate generation

### Phase 5: Testing & Validation (Weeks 17-20)

**Goal:** Ensure compliance and interoperability

1. **Validation Testing**
   - Test all schemas against JSON Schema validators
   - Test ICGLR ID format compliance
   - Test status code validations
   - Test mineral code validations

2. **Integration Testing**
   - Test endpoint responses match standard
   - Test data transformation accuracy
   - Test Rwanda-specific field compliance

3. **Documentation**
   - Document all mappings
   - Document migration procedures
   - Create API usage examples

---

## 7. Implementation Recommendations

### 7.1 Adapter Layer Approach (Recommended)

Given the significant structural differences, implement an **adapter layer** that:

1. **Maintains Existing API**: Keep `/api/sites` and other DMTS endpoints functional
2. **Adds Standard Endpoints**: Implement `/mine-sites`, `/lots`, `/export-certificates` as new endpoints
3. **Data Transformation**: Transform between DMTS internal format and Rwanda Standard format
4. **Gradual Migration**: Allow gradual data migration without breaking existing functionality

**Benefits:**
- No disruption to existing systems
- Allows parallel operation during transition
- Easier rollback if issues arise
- Can be implemented incrementally

### 7.2 Data Mapping Examples

#### Site to MineSite Transformation

```javascript
// DMTS Format (CreateSiteDto)
{
  code: "ENK-1",
  name: "Karangazi II",
  companyId: "c0d3r-32hds-32yyu",
  licenseId: "a688fdb2-f075-460f-98ed-6ea660776e21",
  latitude: -1.9441,
  longitude: 30.0619,
  villageId: "uuid-here",
  status: "active",
  inspected: true,
  allowedTags: 1000
}

// Rwanda Standard Format (MineSite)
{
  icglrId: "RW-1.9441+30.0619-00001",  // Generated from coordinates
  addressCountry: "RW",
  nationalId: "ENK-1",  // Map from code
  certificationStatus: 1,  // Map from inspected (true = 1 Green)
  activityStatus: 1,  // Map from status ("active" = 1 Active)
  mineSiteLocation: {
    geolocalization: {
      lat: -1.9441,
      long: 30.0619
    },
    localGeographicDesignation: {
      // Map from villageId to Address structure
      country: "RW",
      addressLocalityText: "..." // From village lookup
    }
  },
  mineral: [],  // MUST BE ADDED - No equivalent in DMTS
  license: [{
    licenseType: "mining_license",  // From license lookup
    licenseId: "a688fdb2-f075-460f-98ed-6ea660776e21",
    // ... other license fields from lookup
  }],
  owner: {
    // Transform from companyId to BusinessEntity
    identifier: "...",
    name: "...",
    // ... from company lookup
  },
  allowedTags: 1000,  // Already exists
  minesLocations: []  // Rwanda-specific - can be empty initially
}
```

#### Company to BusinessEntity Transformation

```javascript
// DMTS Format (CreateCompanyDto)
{
  tin: "123456789",
  shortName: "ABC Mining",
  name: "ABC Mining Company Ltd",
  businessType: "mining",
  legalRepresentativeName: "John Doe",
  legalAddress: "Kigali, Rwanda",
  physicalAddress: "Kigali, Rwanda",
  contactPhoneNumber: "+250788123456",
  contactEmail: "contact@abcmining.rw",
  organisationType: "company"
}

// Rwanda Standard Format (BusinessEntity)
{
  identifier: "ABC-MINING-001",  // MUST BE GENERATED/ADDED
  name: "ABC Mining Company Ltd",
  tin: "123456789",
  rdbNumber: null,  // MUST BE ADDED (if available)
  rcaNumber: null,  // MUST BE ADDED (if available)
  businessType: "mining",  // Validate against RDB types
  legalAddress: {  // MUST BE STRUCTURED
    country: "RW",
    addressLocalityText: "Kigali",
    // ... structured address
  },
  physicalAddress: {  // MUST BE STRUCTURED
    country: "RW",
    addressLocalityText: "Kigali",
    // ... structured address
  },
  contactDetails: {  // MUST BE STRUCTURED
    legalRepresentative: "John Doe",
    contactPhoneNumber: ["+250788123456"],  // Array format
    contactEmail: "contact@abcmining.rw"
  },
  otherInfo: null  // MUST BE ADDED
}
```

### 7.3 Critical Implementation Notes

1. **ICGLR ID Generation**
   - Must generate from coordinates: `CC-[Lat]-[Long]-NNNNN`
   - Ensure uniqueness (handle collisions)
   - Support both national ID and ICGLR ID

2. **Status Code Mapping**
   - Create mapping table: DMTS status → Standard codes
   - Handle certification status separately from activity status
   - Add status history tracking

3. **Mineral Codes**
   - MUST add mineral tracking to sites
   - Validate against HS Code list
   - Support multiple minerals per site

4. **Chain of Custody**
   - This is completely new functionality
   - Requires significant business logic
   - Must support lot transformations (1-to-1, 1-to-n, n-to-1, n-to-n)

5. **Export Certificates**
   - This is completely new functionality
   - Requires certificate generation logic
   - Must handle file uploads (PDF/PNG/JPEG)
   - Must validate expiration dates (max 90 days)

---

## 8. Compliance Checklist

### 8.1 Endpoint Compliance

- [ ] `/mine-sites` - GET, POST implemented
- [ ] `/mine-sites/{icglrId}` - GET, PUT implemented
- [ ] `/export-certificates` - GET, POST implemented
- [ ] `/export-certificates/{identifier}` - GET implemented
- [ ] `/lots` - GET, POST implemented
- [ ] `/lots/{lotNumber}` - GET implemented
- [ ] `/graphql` - Optional, but recommended
- [ ] `/health` - Optional, but recommended

### 8.2 Schema Compliance

- [ ] `MineSite` - Complete with all required fields
- [ ] `ExportCertificate` - Complete with all required fields
- [ ] `Lot` - Complete with all required fields
- [ ] `BusinessEntity` - Restructured with Rwanda fields
- [ ] `Address` - Structured object (not string)
- [ ] `Geolocalization` - Structured object
- [ ] `MineSiteLocation` - Complete structure
- [ ] `License` - Complete entity (not just ID)
- [ ] `Inspection` - Complete entity (not just boolean)
- [ ] `ContactDetails` - Structured object
- [ ] `Tag` - Complete entity
- [ ] `Tax` - Complete entity
- [ ] `StatusHistory` - Complete entity

### 8.3 Field Compliance

- [ ] ICGLR ID format implemented and validated
- [ ] Certification status (integer 0-3) implemented
- [ ] Activity status (integer 0-2) implemented
- [ ] Mineral codes (HS Codes) implemented
- [ ] `allowedTags` - ✅ Already exists
- [ ] `minesLocations` - Rwanda-specific, added
- [ ] `rdbNumber` - Rwanda-specific, added
- [ ] `rcaNumber` - Rwanda-specific, added
- [ ] `businessType` - ✅ Already exists, validate required
- [ ] `representativeRMB` - Rwanda-specific, added
- [ ] `tagType` - Rwanda-specific, added
- [ ] `miner` - Rwanda-specific, added (conditional)
- [ ] `price` - Rwanda-specific, added

### 8.4 Data Format Compliance

- [ ] ICGLR ID pattern validation
- [ ] Status code integer validation
- [ ] Mineral code (HS Code) validation
- [ ] Date format (YYYY-MM-DD) compliance
- [ ] Time format (hhmmss) support
- [ ] Coordinate precision (4 decimals)
- [ ] Phone number E.164 format
- [ ] Email format validation

---

## 9. Estimated Effort

### Development Effort Estimate

| Phase | Tasks | Estimated Time | Complexity |
|-------|-------|----------------|------------|
| **Phase 1: Foundation** | Core schemas, supporting entities | 4 weeks | Medium |
| **Phase 2: Mine Sites** | MineSite schema, endpoints, migration | 4 weeks | High |
| **Phase 3: Chain of Custody** | Lot schema, endpoints, business logic | 4 weeks | **Very High** |
| **Phase 4: Export Certificates** | ExportCertificate schema, endpoints, file handling | 4 weeks | High |
| **Phase 5: Testing** | Validation, integration testing, documentation | 4 weeks | Medium |
| **Total** | Complete compliance implementation | **20 weeks** | - |

### Risk Factors

1. **High Complexity**: Chain of Custody (Lot) is completely new and complex
2. **Data Migration**: Existing data needs transformation
3. **Business Logic**: New validation rules and conditional requirements
4. **Integration**: Must maintain backward compatibility during transition

---

## 10. Conclusion

The DMTS API has a **very low compatibility (5-8%)** with the Rwanda Mineral Data Interoperability Standard. While it has extensive functionality (248+ endpoints), it follows a different data model that requires significant restructuring.

### Critical Gaps

1. **Missing Primary Entities**: MineSite, ExportCertificate, and Lot entities are completely missing
2. **Different Data Model**: Uses internal structures instead of ICGLR standard format
3. **Missing Rwanda Extensions**: 7 of 9 Rwanda-specific fields are missing
4. **No Chain of Custody**: Critical CoC tracking functionality is absent

### Recommended Approach

1. **Implement Adapter Layer**: Create translation layer between DMTS and standard
2. **Phased Migration**: Implement in 5 phases over 20 weeks
3. **Parallel Operation**: Run both APIs during transition period
4. **Data Transformation**: Map existing data to standard format

### Success Criteria

- All 8 required endpoints implemented
- All 3 primary entities (MineSite, ExportCertificate, Lot) fully functional
- All Rwanda-specific fields implemented
- ICGLR ID format support
- Full Chain of Custody tracking
- Export certificate generation and management

---

**Report Prepared By:** API Compliance Analysis  
**Date:** February 3, 2026  
**Next Review:** After Phase 1 completion

---

*This report provides a comprehensive analysis of what the DMTS API needs to implement to comply with the Rwanda Mineral Data Interoperability Standard Version 2.3.0. For questions or clarifications, contact the Rwanda Mines, Petroleum and Gas Board.*

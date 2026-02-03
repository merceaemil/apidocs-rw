# Rwanda Mineral Data Interoperability Standard - API Conformance Rules

## Overview

This document defines the rules and requirements for APIs to be considered conformant with the Rwanda Mineral Data Interoperability Standard Version 2.3. Conformance ensures interoperability between systems in Rwanda and maintains compatibility with ICGLR requirements for international exchange.

## Conformance Levels

### Level 1: Basic Conformance (Minimum Required)

An API must meet all Level 1 requirements to be considered conformant.

#### 1.1 JSON Schema Validation

- **REQUIRED**: All data structures MUST validate against the JSON schemas defined in `schemas/`
- **REQUIRED**: All required fields as defined in schemas MUST be present
- **REQUIRED**: Data types MUST match schema definitions
- **REQUIRED**: Enum values MUST be from allowed sets

#### 1.2 Identifier Structure

- **REQUIRED**: Mine Sites MUST use `icglrId` field (REQUIRED, not optional)
- **REQUIRED**: Mine Site ICGLR ID format (for ICGLR reporting): Country code (2 letters) + hyphen + latitude (4 decimals, no cardinal) + longitude (4 decimals, no cardinal) + hyphen + sequential number. Example: `RW-1.9641+30.0619-00001`
- **REQUIRED**: All identifiers MUST be unique within the system
- **REQUIRED**: Field names MUST use camelCase convention
- **REQUIRED**: Export Certificate identifier MUST start with ISO 3166-1 alpha-2 country code (e.g., `RW2324A2`)
- **EXAMPLE**: `RW-1.9641+30.0619-00001` for mine sites, `RW2324A2` for export certificates

#### 1.3 Geographic Data

- **REQUIRED**: All location data MUST include `geolocalization` with `lat` and `long` (not `latitude`/`longitude`)
- **REQUIRED**: Latitude (`lat`) MUST be between -90 and 90
- **REQUIRED**: Longitude (`long`) MUST be between -180 and 180
- **REQUIRED**: Coordinates MUST use decimal degrees (WGS84) with 4 decimal places (multipleOf: 0.0001)
- **REQUIRED**: Coordinates MUST use +/- signs, NOT cardinal points (N/S/W/E)
- **REQUIRED**: Address MUST use ISO 3166-2 format for subnational divisions (e.g., `RW-02` for Southern Province, Rwanda)
- **REQUIRED**: Mine Sites MAY include `minesLocations` array (Rwanda-specific) for multiple mine locations within a site

#### 1.4 Date and Time Formats

- **REQUIRED**: All dates MUST use ISO 8601 format (YYYY-MM-DD)
- **REQUIRED**: All date-times MUST use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ) when a date-time is used
- **REQUIRED**: When a semantic field is a Time (ISO 15000-5 primitive), it MUST use ISO 8601 extended time format hh:mm[:ss] with optional zone designator (e.g., `08:32:00` or `14:30:00Z`)
- **REQUIRED**: Time fields MUST follow pattern: `^([0-1][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?(Z|[+-][0-1][0-9]:[0-5][0-9])?$`
- **REQUIRED**: Time zones MUST be specified (preferably UTC) when using date-times

#### 1.5 Country Codes

- **REQUIRED**: Country codes MUST use ISO 3166-1 alpha-2 format
- **REQUIRED**: Country code will always be RW (Rwanda) for national use
- **NOTE**: For international exchange, the standard maintains compatibility with ICGLR member state codes

#### 1.6 Units of Measure

- **REQUIRED**: All quantities MUST include both value and unit
- **REQUIRED**: Units MUST be chosen from UN/ECE Recommendation N°. 20 "Codes for Units of Measure Used in International Trade"
- **REQUIRED**: Units MUST be clearly specified (e.g., "KGM" for kilograms, "TNE" for metric tons)
- **RECOMMENDED**: Units SHOULD follow SI standards where applicable

#### 1.7 Naming Convention

- **REQUIRED**: All technical field names MUST use camelCase convention
- **REQUIRED**: Examples: `icglrId`, `certificationStatus`, `mineSiteLocation`, `dateOfIssuance`
- **REQUIRED**: NO snake_case or PascalCase in field names

#### 1.8 Code Lists

- **REQUIRED**: Certification Status MUST use integer codes: 0=Blue (Uninspected), 1=Green (Certified), 2=Yellow (Yellow-Flagged), 3=Red (Un-Certified)
- **REQUIRED**: Activity Status MUST use integer codes: 0=Abandoned, 1=Active, 2=Non-active
- **REQUIRED**: License Status MUST use string codes: "0"=Non-Active, "1"=Active (NOT integer)
- **REQUIRED**: CoC Roles MUST use integer codes: 1=Miner, 2=Trader (in-country), 3=Shipper, 4=Processor, 5=Warehouse, 6=Importer, 7=Exporter, 8=Government
- **REQUIRED**: Originating Operations MUST use integer codes: 1=Production, 2=Purchase, 3=Combination/Aggregation, 4=Processing, 5=Transportation, 6=Storage/Warehousing, 7=Import, 8=Export
- **REQUIRED**: Mineral codes MUST use HS Codes (primary) or IMA Codes (e.g., `7108.12.00` for Gold, `2609.00.00` for Cassiterite, `2611.00.00` for Wolframite, `2615.90.00` for Columbite-Tantalite/Coltan)
- **REQUIRED**: License Type MUST use string codes: "claim", "exploration_permit", "mining_license", "artisanal_permit", "unlicensed", "other"
- **REQUIRED**: Unit of Measurement MUST use codes from UN/ECE Recommendation N°. 20: "TNE" (tonne), "KGM" (kilogram)

### Level 2: API Endpoint Conformance

#### 2.1 OpenAPI Specification

- **REQUIRED**: API MUST implement endpoints as defined in `api/openapi.yaml`
- **REQUIRED**: HTTP methods MUST match OpenAPI specification
- **REQUIRED**: Request/response formats MUST match OpenAPI schemas
- **REQUIRED**: Status codes MUST follow REST conventions (200, 201, 400, 404, 500, etc.)

#### 2.2 Endpoint Requirements

**Mine Sites Endpoints (MD.01):**
- **REQUIRED**: `GET /mine-sites` - List mine sites with filtering
- **REQUIRED**: `GET /mine-sites/{icglrId}` - Get specific mine site by ICGLR ID (if icglrId is provided) or by nationalId
- **REQUIRED**: `POST /mine-sites` - Create mine site
- **RECOMMENDED**: `PUT /mine-sites/{icglrId}` - Update mine site

**Export Certificates Endpoints (MD.03):**
- **REQUIRED**: `GET /export-certificates` - List export certificates with filtering
- **REQUIRED**: `GET /export-certificates/{identifier}` - Get certificate (requires `issuingCountry` query param)
- **REQUIRED**: `POST /export-certificates` - Create export certificate

**Chain of Custody - Lots Endpoints (MD.12):**
- **REQUIRED**: `GET /lots` - List lots with filtering
- **REQUIRED**: `GET /lots/{lotNumber}` - Get specific lot by lot number
- **REQUIRED**: `POST /lots` - Create lot record

#### 2.3 Pagination

- **REQUIRED**: List endpoints MUST support pagination
- **REQUIRED**: Pagination MUST use `page` and `limit` query parameters
- **REQUIRED**: Response MUST include pagination metadata:
  ```json
  {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrevious": false
    }
  }
  ```

#### 2.4 Filtering

- **REQUIRED**: List endpoints MUST support filtering as defined in OpenAPI spec
- **REQUIRED**: Filter parameters MUST match OpenAPI parameter definitions (camelCase)
- **REQUIRED**: Filtering MUST be case-insensitive for string fields
- **REQUIRED**: Status filters MUST accept integer codes (0, 1, 2, 3 for certification; 0, 1, 2 for activity)
- **REQUIRED**: Mineral filters MUST accept HS Codes or IMA Codes

#### 2.5 Error Handling

- **REQUIRED**: Errors MUST follow the Error schema defined in OpenAPI
- **REQUIRED**: Error responses MUST include:
  - `code`: Error code string
  - `message`: Human-readable error message
  - `timestamp`: ISO 8601 timestamp
- **REQUIRED**: Validation errors MUST return HTTP 400 with details
- **REQUIRED**: Not found errors MUST return HTTP 404
- **REQUIRED**: Server errors MUST return HTTP 500

### Level 3: JSON-LD Support (Recommended)

#### 3.1 JSON-LD Context

- **RECOMMENDED**: API SHOULD support `application/ld+json` content type
- **RECOMMENDED**: Responses SHOULD include `@context` when requested with `Accept: application/ld+json`
- **RECOMMENDED**: Context SHOULD reference `https://rwanda.gov.rw/json-ld/context.jsonld`

#### 3.2 Linked Data

- **RECOMMENDED**: Entities SHOULD be dereferenceable via their `@id`
- **RECOMMENDED**: Related entities SHOULD use `@id` references

### Level 4: GraphQL Support (Optional)

#### 4.1 GraphQL Endpoint

- **OPTIONAL**: API MAY implement GraphQL endpoint at `/graphql`
- **OPTIONAL**: GraphQL schema SHOULD match `graphql/schema.graphql`
- **OPTIONAL**: GraphQL queries SHOULD support all Query type fields

#### 4.2 Flexible Querying

- **OPTIONAL**: API MAY support the `query` field for federated queries
- **OPTIONAL**: API MAY support querying non-standard data structures

## Validation Requirements

### 4.1 Input Validation

- **REQUIRED**: All input data MUST be validated against JSON schemas before processing
- **REQUIRED**: Validation errors MUST be returned with specific field-level details
- **REQUIRED**: Invalid data MUST NOT be persisted

### 4.2 Output Validation

- **REQUIRED**: All output data MUST conform to JSON schemas
- **RECOMMENDED**: Output SHOULD be validated before sending response

### 4.3 Schema Versioning

- **REQUIRED**: API MUST indicate schema version in responses
- **REQUIRED**: Breaking changes MUST increment major version
- **REQUIRED**: API version MUST be included in URL path (e.g., `/v1/`)

### 4.4 Rwanda-Specific Validation Rules

#### 4.4.1 Mine Site Validation

- **REQUIRED**: `icglrId` MUST be present (required, not optional)
- **REQUIRED**: `addressCountry` MUST always be "RW"
- **REQUIRED**: `allowedTags` MUST be an integer (Rwanda-specific field)
- **REQUIRED**: `minesLocations` MUST be an array of Geolocalization objects (Rwanda-specific field)
- **OPTIONAL**: `nationalId` is optional (0..1)

#### 4.4.2 Business Entity Validation

- **REQUIRED**: `businessType` MUST be present (required field)
- **REQUIRED**: Either `legalAddress` OR `physicalAddress` MUST exist (at least one)
- **REQUIRED**: `contactDetails` MUST be present
- **REQUIRED**: `contactEmail` MUST be valid email format
- **REQUIRED**: `contactPhoneNumber` MUST use E.164 format (starting with +, max 15 digits)
- **OPTIONAL**: `rdbNumber` and `rcaNumber` are Rwanda-specific optional fields
- **OPTIONAL**: `streetAddress` is optional in Address

#### 4.4.3 Export Certificate Validation

- **REQUIRED**: `issuingCountry` MUST always be "RW"
- **REQUIRED**: `identifier` MUST start with country code (e.g., "RW2324A2")
- **REQUIRED**: `lotWeight` MUST be positive (>0) with maximum 3 decimals (0.000)
- **REQUIRED**: `mineralOrigin` MUST have one of these formats:
  - Single country code (e.g., "BI")
  - Semicolon-separated array (e.g., "BI;TZ;CD")
  - Character "0" for unknown origin
  - Combination with "0" (e.g., "BI;TZ;0")
- **REQUIRED**: `shipmentRoute` MUST be comma-separated country codes without spaces (e.g., "CD,TZ,BI")
- **REQUIRED**: `dateOfExpiration` MUST NOT exceed `dateOfIssuance` plus 90 days
- **REQUIRED**: `certificateFile` MIME type MUST be one of: application/pdf, image/png, image/jpeg
- **REQUIRED**: `certificateFile` size MUST be limited (recommended max 10 MB, can be stricter at national level)

#### 4.4.4 Lot Validation

- **REQUIRED**: `timeRegistration` MUST use ISO 8601 extended time format (hh:mm:ss)
- **REQUIRED**: When `originatingOperation` includes 1 (Production):
  - `mineSiteId` MUST be present
  - `miner` MUST be present (Rwanda-specific)
  - `tag` MUST be present
- **REQUIRED**: `price` MUST be present (Rwanda-specific, required as $/kg)
- **REQUIRED**: `concentration` MUST be a decimal number
- **REQUIRED**: `mass` MUST be a decimal number
- **REQUIRED**: `unitOfMeasurement` MUST be from UN/ECE Recommendation N°. 20 (e.g., "TNE", "KGM")

#### 4.4.5 Tag Validation

- **REQUIRED**: `issueTime` MUST use ISO 8601 extended time format (hh:mm:ss)
- **REQUIRED**: `representativeRMB` MUST be present (Rwanda-specific)
- **OPTIONAL**: `tagType` is optional

#### 4.4.6 Inspection Validation

- **REQUIRED**: `inspectionResponsible` MUST be present (Rwanda-specific)
- **REQUIRED**: `inspectionReport` MIME type MUST be one of: application/pdf, text/plain, application/vnd.openxmlformats-officedocument.wordprocessingml.document
- **REQUIRED**: `inspectionReport` file size MUST be limited to 8 MB

#### 4.4.7 Address Validation

- **REQUIRED**: `country` MUST always be "RW"
- **REQUIRED**: `subnationalDivisionL1` MUST be one of: "RW-01", "RW-02", "RW-03", "RW-04", "RW-05"
- **REQUIRED**: `subnationalDivisionL1Text` MUST be one of: "City of Kigali", "Eastern", "Northern", "Southern", "Western"
- **OPTIONAL**: `subnationalDivisionL2`, `subnationalDivisionL3`, `subnationalDivisionL4` are optional
- **OPTIONAL**: `streetAddress` is optional

## Security Requirements

### 5.1 Authentication

- **REQUIRED**: API MUST implement authentication
- **REQUIRED**: Authentication MUST use Bearer tokens (JWT) or API keys
- **REQUIRED**: Authentication MUST be documented in OpenAPI security schemes

### 5.2 Authorization

- **REQUIRED**: API MUST implement authorization based on user roles
- **REQUIRED**: Different endpoints MAY have different authorization requirements
- **RECOMMENDED**: Authorization SHOULD follow principle of least privilege

### 5.3 Data Integrity

- **REQUIRED**: API MUST ensure data integrity (prevent tampering)
- **RECOMMENDED**: API SHOULD use cryptographic signatures for critical data
- **RECOMMENDED**: Attachments SHOULD include hash values for verification

## Performance Requirements

### 6.1 Response Times

- **REQUIRED**: GET requests SHOULD respond within 2 seconds for single resources
- **REQUIRED**: GET requests SHOULD respond within 5 seconds for list endpoints
- **RECOMMENDED**: POST/PUT requests SHOULD respond within 3 seconds

### 6.2 Rate Limiting

- **RECOMMENDED**: API SHOULD implement rate limiting
- **RECOMMENDED**: Rate limits SHOULD be documented
- **RECOMMENDED**: Rate limit headers SHOULD be included in responses

## Documentation Requirements

### 7.1 API Documentation

- **REQUIRED**: API MUST provide OpenAPI/Swagger documentation
- **REQUIRED**: Documentation MUST be accessible and up-to-date
- **REQUIRED**: All endpoints MUST be documented with examples

### 7.2 Implementation Guide

- **RECOMMENDED**: API provider SHOULD provide implementation guide
- **RECOMMENDED**: Examples SHOULD be provided for all major use cases

## Testing and Certification

### 8.1 Conformance Testing

- **REQUIRED**: API MUST pass all conformance tests in `conformance/test-suites/`
- **REQUIRED**: Test results MUST be documented
- **RECOMMENDED**: Automated conformance testing SHOULD be implemented

### 8.2 Test Coverage

- **REQUIRED**: All required endpoints MUST have test coverage
- **REQUIRED**: Error cases MUST be tested
- **RECOMMENDED**: Edge cases SHOULD be tested

## Migration and Compatibility

### 9.1 Backward Compatibility

- **REQUIRED**: API versions MUST maintain backward compatibility within major version
- **REQUIRED**: Deprecated features MUST be announced with sufficient notice
- **REQUIRED**: Breaking changes MUST increment major version

### 9.2 Data Migration

- **RECOMMENDED**: API SHOULD support data migration tools
- **RECOMMENDED**: Migration documentation SHOULD be provided

## Reporting Conformance

### 10.1 Conformance Statement

API providers MUST provide a conformance statement indicating:
- Conformance level achieved (1-4)
- Endpoints implemented
- Optional features supported
- Known limitations

### 10.2 Conformance Testing Report

API providers SHOULD provide:
- Test execution results
- Test coverage report
- Performance metrics
- Security assessment

## Non-Conformance

APIs that do not meet Level 1 requirements are considered non-conformant and:
- MUST NOT claim Rwanda standard compliance
- MAY be listed as "in development" or "partial implementation"
- SHOULD provide roadmap to full conformance

## Updates to Conformance Rules

These rules may be updated by Rwanda Mines, Petroleum and Gas Board. Changes will be:
- Versioned
- Documented in changelog
- Announced with sufficient notice period
- Backward compatible where possible

## Contact

For questions about conformance, contact the Rwanda Mines, Petroleum and Gas Board (RMB).


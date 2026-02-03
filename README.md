# Rwanda Mineral Data Interoperability Standard

## Overview

This repository contains the technical implementation model for the Rwanda Mineral Data Interoperability Standard Version 2.3. The standard enables interoperability of all systems at national level that handle minerals related data, in particular in the chain of custody of the conflict minerals but not only.

## Purpose

The standard defines:
- **Semantic Model**: Conceptual framework for mining data (defined in `DOCUMENTATION.txt`)
- **Technical Implementation Model**: JSON structures, APIs, and data exchange mechanisms

**Important Note**: This standard is designed for **data exchange**, not as a relational database schema. While implementers may choose to structure storage similarly, the standard focuses on interoperability and data sharing.

## Semantic Model

The semantic model is based on the Rwanda Mineral Data Interoperability Standard Version 2.3 (defined in `DOCUMENTATION.txt`) and defines:

### Primary Entities (MD.01 - MD.13)
- **MD.01 Mine Site**: Core mining site information
- **MD.03 Export Certificate**: ICGLR export certificates
- **MD.12 Lot**: Chain of Custody lot tracking

### Secondary Entities
- **MD.02 License**: Mining licenses
- **MD.04 Business Entity**: Companies and organizations
- **MD.05 Address**: Address information
- **MD.06 Geolocalization**: Geographic coordinates
- **MD.07 Inspection**: Mine site inspections
- **MD.08 Mine Site Location**: Location details
- **MD.09 Contact Details**: Contact information
- **MD.10 Status History**: Certification status changes
- **MD.11 Tag**: Lot tags
- **MD.13 Tax**: Tax payment information

### Code Lists (MDC.01 - MDC.07)
- **MDC.01 Certification Status**: 0=Blue, 1=Green, 2=Yellow, 3=Red
- **MDC.02 Mining Activity Status**: 0=Abandoned, 1=Active, 2=Non-active
- **MDC.03 Mineral**: HS Codes and IMA Codes
- **MDC.04 License Type**: claim, exploration_permit, mining_license, etc.
- **MDC.05 CoC Roles**: 1=Miner, 2=Trader, 3=Shipper, etc.
- **MDC.06 Originating Operations**: 1=Production, 2=Purchase, 3=Combination, etc.
- **MDC.07 Unit of Measurement**: TNE (tonne), KGM (kilogram)

## Repository Structure

```
.
├── README.md                          # This file
├── DOCUMENTATION.txt                  # Semantic model documentation
├── MIGRATION_NOTES.md                 # Migration notes from initial implementation
├── schemas/                           # JSON Schema definitions
│   ├── core/                         # Core data structures
│   │   └── common.json               # Common definitions
│   ├── mine-site/                    # Mine site entities
│   │   ├── mine-site.json            # MD.01 Mine Site
│   │   ├── license.json              # MD.02 License
│   │   ├── mine-site-location.json   # MD.08 Mine Site Location
│   │   ├── inspection.json            # MD.07 Inspection
│   │   └── status-history.json       # MD.10 Status History
│   ├── export-certificate/           # Export certificate entities
│   │   └── export-certificate.json  # MD.03 Export Certificate
│   └── chain-of-custody/             # Chain of Custody entities
│       ├── lot.json                  # MD.12 Lot
│       ├── tag.json                  # MD.11 Tag
│       └── tax.json                  # MD.13 Tax
├── api/                               # API specifications
│   ├── openapi.yaml                  # Main OpenAPI/Swagger specification
│   └── examples/                     # API usage examples
├── json-ld/                           # JSON-LD context definitions
│   ├── context.jsonld                # Main JSON-LD context
│   └── vocab/                        # Vocabulary definitions
├── graphql/                           # GraphQL schemas
│   ├── schema.graphql                # Main GraphQL schema
│   └── resolvers/                    # GraphQL resolver examples
├── conformance/                       # Conformance rules
│   ├── rules.md                      # Conformance rules documentation
│   ├── validators/                   # Validation schemas and tools
│   └── test-suites/                  # Test cases for conformance
├── examples/                          # Example implementations
│   ├── json/                         # JSON data examples
│   │   ├── mine-site-example.json
│   │   ├── export-certificate-example.json
│   │   └── lot-example.json
│   └── requests/                     # API request examples
└── docs/                              # Additional documentation
    ├── architecture.md               # Architecture overview
    └── implementation-guide.md       # Implementation guide
```

## Key Features

### 1. Mine Site Identification

Mine sites can use a standardized ICGLR ID format (optional):
```
CC-[Lat]-[Long]-NNNNN
```

Example: `RW-1.9641+30.0619-00001`
- CC: Country code (ISO 3166-1 alpha-2)
- [Lat]: Latitude with 4 decimals, no cardinal point (using - and + signs)
- [Long]: Longitude with 4 decimals, no cardinal point (using - and + signs)
- NNNNN: Sequential number

**Note**: The `icglrId` is optional (0..1) and should be present if the data record needs to be reported as-is to ICGLR. The `nationalId` is also optional (0..1) and is a unique identification number at the level of the country.

### 2. Rwanda-Specific Features

- **Address**: Country will always be RW. Subnational divisions follow ISO 3166-2:RW format (RW-01 through RW-05 for provinces)
- **Business Entity**: Includes Rwanda-specific fields: `rdbNumber`, `rcaNumber`, and `businessType` (from RDB types)
- **Mine Site**: Includes `allowedTags` (list of approved tag numbers) and `minesLocations` (array of mine locations within a mine site)
- **Lot**: Includes `miner` field (name of miner who represented the team) and `price` field (required in Rwanda as $/kg)
- **Tag**: Includes `representativeRMB` field (name of RMB representative who approved)

### 3. Naming Convention

All technical terms use **camelCase** as specified in the semantic model:
- `icglrId` (optional)
- `nationalId`
- `certificationStatus`
- `mineSiteLocation`
- `dateOfIssuance`
- `allowedTags`
- `minesLocations`

### 3. Code Lists

Status values use integer codes for language independence:
- Certification Status: 0 (Blue), 1 (Green), 2 (Yellow), 3 (Red)
- Activity Status: 0 (Abandoned), 1 (Active), 2 (Non-active)
- CoC Roles: 1-8 (Miner, Trader, Shipper, Processor, etc.)
- Originating Operations: 1-8 (Production, Purchase, Combination, etc.)

### 4. Geolocalization

Geographic coordinates use WGS 84 format with 4 decimals:
- Property names: `lat` and `long` (not `latitude` and `longitude`)
- Format: Using - and + signs, not cardinal points (N/S/W/E)
- Example: `{"lat": -1.9641, "long": +30.0619}`

### 5. Mineral Codes

Minerals are identified using:
- **HS Codes**: Harmonized System codes (primary) - e.g., `7108.12.00` for Gold
- **IMA Codes**: International Mineralogical Association codes (alternative) - e.g., `IMA1960-A` for Gold

Designated minerals (3TG):
- Gold: `7108.12.00` / `IMA1960-A`
- Cassiterite: `2609.00.00` / `IMA1960-001`
- Wolframite: `2611.00.00` / `IMA2000-014`
- Columbite-Tantalite (Coltan): `2615.90.00` / `IMA1979-A`

## Components

### 1. JSON Structures
JSON Schema definitions for all data structures in the Rwanda Mineral Data Interoperability Standard. Located in `schemas/`.

### 2. OpenAPI/Swagger Specifications
Default API endpoints and operations for data exchange. Located in `api/openapi.yaml`.

### 3. JSON-LD Model
Semantic web representation of the data model for linked data interoperability. Located in `json-ld/`.

### 4. GraphQL Schema
GraphQL-based mechanism for querying APIs with different structures than the standard mandates. Located in `graphql/`.

### 5. Conformance Rules
Rules and validation mechanisms to ensure APIs conform to the standard. Located in `conformance/`.

## Getting Started

1. Review the semantic model in `DOCUMENTATION.txt`
2. Examine JSON schemas in `schemas/`
3. Review API specifications in `api/openapi.yaml`
4. Check conformance rules in `conformance/rules.md`
5. See examples in `examples/`

## Implementation

Implementers should:
- Use JSON schemas for data validation
- Implement OpenAPI endpoints as specified
- Ensure conformance with validation rules
- Support JSON-LD for semantic interoperability
- Consider GraphQL for flexible querying
- Use camelCase for all technical terms
- Follow the ICGLR ID format for mine sites (if reporting to ICGLR)
- Use integer codes for status values
- Include Rwanda-specific fields as required (allowedTags, minesLocations, rdbNumber, rcaNumber, businessType, miner, price, representativeRMB)
- Use `lat` and `long` for geolocalization (not `latitude` and `longitude`)
- Ensure addresses always use country code "RW"

## Chain of Custody

The Lot entity (MD.12) is central to Chain of Custody tracking:
- Supports all CoC operations (Production, Purchase, Combination, Processing, etc.)
- Tracks lot transformations (1-to-1, 1-to-n, n-to-1, n-to-n)
- Maintains references to input lots
- Links to mine sites, tags, and export certificates

## Extension and Localization

This Rwanda standard is a localized version of the ICGLR data model that:
- **Extends** the model with Rwanda-specific attributes (allowedTags, minesLocations, rdbNumber, rcaNumber, businessType, miner, price, representativeRMB)
- **Restricts** certain fields (e.g., addressCountry always "RW")
- **Specifies** usage rules (formatting, sizes, values) for Rwanda context

All extensions maintain compatibility with the core ICGLR model for reporting purposes.

## Contributing

This is a Rwanda national standard. Contributions should follow Rwanda Mines, Petroleum and Gas Board governance procedures.

## License

Rwanda Mineral Data Interoperability Standard License

## Contact

Rwanda Mines, Petroleum and Gas Board
Website: https://rmb.rw

## References

- Rwanda Mineral Data Interoperability Standard Version 2.3 (DOCUMENTATION.txt)
- ICGLR RCM Manual
- ISO 3166-1, ISO 3166-2 (Country and subdivision codes)
- ISO 15000-5:2014, Annex B (Primitive Types)
- UN/ECE Recommendation N°. 20 (Units of Measure)
- WGS 84 (Geographic coordinates)

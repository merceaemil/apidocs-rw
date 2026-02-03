# Rwanda Mineral Data Interoperability Standard - Vocabulary

This directory contains vocabulary definitions for the Rwanda Mineral Data Interoperability Standard Version 2.3.

## Vocabulary Base URI

- **Base URI**: `https://rwanda.gov.rw/vocab/`
- **Prefix**: `rwanda:`

## Primary Entity Classes

- `rwanda:MineSite` - Mine site entity (MD.01)
- `rwanda:ExportCertificate` - Export certificate (MD.03, ICGLR Regional Certificate)
- `rwanda:Lot` - Chain of Custody lot (MD.12)

## Secondary Entity Classes

- `rwanda:License` - Mining license (MD.02)
- `rwanda:BusinessEntity` - Business entity/company (MD.04)
- `rwanda:Address` - Address with ISO 3166-2 subdivisions (MD.05)
- `rwanda:Geolocalization` - Geographic coordinates (MD.06)
- `rwanda:Inspection` - Mine site inspection (MD.07)
- `rwanda:MineSiteLocation` - Mine site location details (MD.08)
- `rwanda:ContactDetails` - Contact information (MD.09)
- `rwanda:StatusHistory` - Certification status history (MD.10)
- `rwanda:Tag` - Lot tag (MD.11)
- `rwanda:Tax` - Tax payment information (MD.13)

## External Vocabularies Used

- **Schema.org** (`schema:`): For general-purpose structured data
- **Dublin Core** (`dc:`): For metadata properties
- **WGS84 Geo** (`geo:`): For geographic coordinates
- **RDF/RDFS** (`rdf:`, `rdfs:`): For RDF foundations

## Usage

The JSON-LD context is defined in `../context.jsonld`. To use it in your JSON data:

```json
{
  "@context": "https://rwanda.gov.rw/json-ld/context.jsonld",
  "@type": "rwanda:MineSite",
  "icglrId": "RW-1.9641+30.0619-00001",
  "addressCountry": "RW",
  "certificationStatus": 1,
  "mineSiteLocation": {
      "@type": "rwanda:MineSiteLocation",
      "geolocalization": {
        "@type": "rwanda:Geolocalization",
        "lat": -1.9641,
        "long": 30.0619
    }
  }
}
```

## Field Naming

All technical terms use **camelCase** convention:
- `icglrId`
- `certificationStatus`
- `mineSiteLocation`
- `dateOfIssuance`

## Code Lists

Status values use integer codes for language independence:
- Certification Status: 0=Blue, 1=Green, 2=Yellow, 3=Red
- Activity Status: 0=Abandoned, 1=Active, 2=Non-active
- CoC Roles: 1=Miner, 2=Trader, 3=Shipper, 4=Processor, 5=Warehouse, 6=Importer, 7=Exporter, 8=Government
- Originating Operations: 1=Production, 2=Purchase, 3=Combination, 4=Processing, 5=Transportation, 6=Storage/Warehousing, 7=Import, 8=Export

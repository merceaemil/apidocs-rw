# AI-Powered OpenAPI Compliance Evaluation Guide

This guide explains how to use AI tools (like ChatGPT, Claude, or similar) to evaluate your OpenAPI specification against the Rwanda Mineral Data Interoperability Standard and generate a comprehensive compliance report.

---

## Quick Start

1. **Prepare your OpenAPI file** (YAML or JSON format)
2. **Get the Rwanda Standard OpenAPI file** (`api/openapi.yaml`)
3. **Copy the prompt below** and replace placeholders with your file information
4. **Paste into your AI tool** and review the generated report

---

## What You Need

### Required Files

1. **Your OpenAPI Specification**
   - File: `your-api.yaml` or `your-api.json`
   - Format: OpenAPI 3.0.x (YAML or JSON)
   - Location: Anywhere accessible to your AI tool

2. **Rwanda Standard OpenAPI Specification**
   - File: `api/openapi.yaml` (in this repository)
   - URL: You can reference it or copy the content
   - Version: 2.3.0

### Optional but Helpful

- **Semantic Model Documentation**: `DOCUMENTATION.txt` (for understanding entity definitions)
- **Complete Documentation**: `COMPLETE_DOCUMENTATION.md` (for detailed field descriptions)

---

## How to Provide Files to AI

### Option A: Upload Files Directly
- If your AI tool supports file uploads, upload both:
  - Your OpenAPI spec
  - The Rwanda Standard OpenAPI spec (`api/openapi.yaml`)

### Option B: Provide File Contents
- Copy and paste the contents of both files into the AI conversation
- Or provide file paths/URLs if the AI can access them

### Option C: Provide File Locations
- Share GitHub repository links
- Share file URLs
- Share file paths (if AI has access)

---

## Comprehensive Compliance Report Prompt

**Copy and paste this prompt into your AI tool to generate a detailed compliance report similar to `API_COMPLIANCE_REPORT.md`:**

```
I need a comprehensive compliance evaluation of my OpenAPI specification against the Rwanda Mineral Data Interoperability Standard. Generate a detailed markdown report.

**Rwanda Standard OpenAPI:**
[Paste content of api/openapi.yaml or provide file path/URL]

**My OpenAPI Specification:**
[Paste your OpenAPI spec content or provide file path/URL]

**Instructions:**
1. Focus on SEMANTIC SIMILARITY, not exact name matches. For example, "sites" or "mines" should be matched to "mine-sites", "companies" to "business-entity", etc.

2. Generate a comprehensive markdown report with the following structure:

## Executive Summary
- Overall compatibility score (0-100%) with breakdown by:
  - Primary endpoints match percentage
  - Core entity schemas match percentage
  - Supporting schemas match percentage
  - Rwanda-specific fields match percentage
- Key findings (3-5 bullet points)
- Primary issues summary

## 1. Endpoint Analysis
### 1.1 Missing Required Endpoints
- Table of all standard endpoints that are missing
- For each: purpose, priority (CRITICAL/HIGH/MEDIUM), and any conceptual equivalent in my API

### 1.2 Semantic Endpoint Mapping
- For each endpoint that has a conceptual match:
  - Similarity percentage
  - Similarities list
  - Required changes (ID format, query parameters, response format, data structure)

### 1.3 Completely Missing Endpoints
- List endpoints that have NO equivalent and MUST be created

## 2. Schema/Entity Analysis
### 2.1 Primary Entities (MD.01, MD.03, MD.12)
For each primary entity (MineSite, ExportCertificate, Lot):
- Status (Found/Partially Found/Missing)
- What my API has instead (if anything)
- Complete table of all required attributes showing:
  - Attribute name, type, required status, description
  - Status in my API (✅ Exists / ⚠️ Partial / ❌ Missing)
- Key gaps summary

### 2.2 Secondary Entities
For each secondary entity (BusinessEntity, Address, License, Inspection, etc.):
- Similarity percentage
- Field mapping table (Standard Field → My Field → Match Status → Notes)
- Required changes list
- Any extra fields in my API that aren't in standard

## 3. Rwanda-Specific Fields Analysis
- Table of all 9 Rwanda-specific fields:
  - Field name, entity, required status, current status, notes
- Summary of how many exist vs missing

## 4. Data Format and Code List Compliance
### 4.1 ID Format Issues
- Standard requirement vs my current format
- Required changes

### 4.2 Status Code Issues
- Standard requirement (integer codes) vs my current format
- Required changes

### 4.3 Mineral Code Issues
- Standard requirement (HS Codes) vs my current format
- Required changes

### 4.4 Date/Time Format Issues
- Standard requirement vs my current format
- Required changes

## 5. Required Changes Summary
### 5.1 Critical Changes (Must Have)
- Endpoints that must be created/modified
- Schemas that must be created/modified
- Fields that must be added/modified

### 5.2 High Priority Changes
- List with priorities

### 5.3 Medium Priority Changes
- List with priorities

## 6. Migration Strategy
Provide a phased implementation plan:
- Phase 1: Foundation (what schemas/entities, timeline)
- Phase 2: Primary entities (what to implement, timeline)
- Phase 3: Chain of Custody (if applicable, timeline)
- Phase 4: Export Certificates (if applicable, timeline)
- Phase 5: Testing & Validation (timeline)

For each phase: goal, tasks, estimated time, complexity

## 7. Implementation Recommendations
### 7.1 Approach Recommendation
- Adapter layer vs direct modification
- Rationale

### 7.2 Data Mapping Examples
- Show before/after examples for key transformations
- Include code examples if possible

### 7.3 Critical Implementation Notes
- Key technical considerations
- Important validation rules
- Business logic requirements

## 8. Compliance Checklist
- Endpoint compliance checklist
- Schema compliance checklist
- Field compliance checklist
- Data format compliance checklist

## 9. Estimated Effort
- Table showing phases, tasks, estimated time, complexity
- Risk factors

## 10. Conclusion
- Summary of compatibility
- Critical gaps recap
- Recommended approach
- Success criteria

**Important Notes:**
- Use semantic matching: "sites" → "mine-sites", "companies" → "business-entity"
- Be thorough in field-by-field comparisons
- Provide specific, actionable recommendations
- Include code examples for transformations where helpful
- Mark Rwanda-specific fields clearly
- Use ✅ for exists, ⚠️ for partial, ❌ for missing
```

---

## Important: Semantic Matching

The AI must understand that you want **semantic similarity**, not exact name matches. If the AI doesn't understand this, add this clarification:

```
When comparing, look for CONCEPTUAL similarity, not exact name matches:
- "sites" or "mines" → "mine-sites" (similar concept)
- "companies" or "organizations" → "business-entity" (similar concept)
- "tags" might map to "Tag" entity
- Look at the fields and functionality, not just the names
```

---

## What You'll Get

The AI will generate a comprehensive markdown report that includes:

- ✅ **Compatibility scores** and metrics
- ✅ **Detailed endpoint and schema comparisons** with semantic matching
- ✅ **Field-by-field analysis** for all entities
- ✅ **Rwanda-specific field compliance** (9 fields checked)
- ✅ **Data format compliance issues** (IDs, status codes, mineral codes, dates)
- ✅ **Prioritized change recommendations** (Critical/High/Medium)
- ✅ **Migration strategy** with phased implementation plan
- ✅ **Implementation examples** with code snippets
- ✅ **Compliance checklists** for validation
- ✅ **Effort estimates** with risk factors

The report will be similar in structure and detail to `API_COMPLIANCE_REPORT.md`.

---

## Next Steps After AI Evaluation

1. **Review the AI analysis** - Understand the gaps and compatibility score
2. **Prioritize changes** - Focus on critical items first
3. **Create implementation plan** - Break down into phases
4. **Start with foundation** - Core schemas and data structures
5. **Test incrementally** - Validate each phase
6. **Document mappings** - Keep track of transformations
7. **Seek clarification** - Contact RMB if needed

---

## Getting Help

If the AI analysis raises questions or you need clarification:

1. **Review Documentation:**
   - `COMPLETE_DOCUMENTATION.md` - Full standard documentation
   - `DOCUMENTATION.txt` - Semantic model definitions
   - `api/openapi.yaml` - Complete API specification

2. **Contact Support:**
   - Rwanda Mines, Petroleum and Gas Board (RMB)
   - Reference your evaluation report

3. **Use Validation Tools:**
   - JSON Schema validators
   - OpenAPI validators
   - Custom validation scripts

---

**Last Updated:** February 2026  
**Standard Version:** 2.3.0

---

*This guide helps you leverage AI tools to quickly assess your API's compliance with the Rwanda Mineral Data Interoperability Standard. The AI analysis should be used as a starting point - always validate against the official documentation.*

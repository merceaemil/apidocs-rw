/**
 * Lots Service
 */

const { db } = require('../database');
const validator = require('../../../conformance/validators/schema-validator');

// Import helper functions from mine-sites service
const mineSitesService = require('./mine-sites');
const insertOrGetBusinessEntity = mineSitesService.insertOrGetBusinessEntity;
const getBusinessEntity = mineSitesService.getBusinessEntity;

function reconstructLot(row) {
  const creator = getBusinessEntity(row.creatorId);
  const recipient = row.recipientId ? getBusinessEntity(row.recipientId) : null;

  // Get creator roles
  const creatorRoles = db.prepare(`
    SELECT roleCode FROM lotCreatorRoles WHERE lotNumber = ?
  `).all(row.lotNumber).map(r => r.roleCode);

  // Get originating operations
  const originatingOperations = db.prepare(`
    SELECT operationCode FROM lotOriginatingOperations WHERE lotNumber = ?
  `).all(row.lotNumber).map(r => r.operationCode);

  // Get input lots
  const inputLots = db.prepare(`
    SELECT inputLotNumber FROM lotInputLots WHERE lotNumber = ?
  `).all(row.lotNumber).map(r => ({ lotNumber: r.inputLotNumber }));

  // Get tag - use denormalized fields from lots table if available, otherwise query tags table
  const tag = row.tagIdentifier ? {
    identifier: row.tagIdentifier,
    issuer: row.tagIssuerId ? getBusinessEntity(row.tagIssuerId) : null,
    issueDate: row.tagIssueDate || null,
    issueTime: row.tagIssueTime || null,
    representativeRMB: row.tagRepresentativeRMB || null,
    tagType: row.tagTagType || null
  } : null;

  // Get taxes
  const taxes = db.prepare(`
    SELECT t.* FROM taxes t
    JOIN lotTaxes lt ON t.id = lt.taxId
    WHERE lt.lotNumber = ?
  `).all(row.lotNumber).map(taxRow => ({
    taxType: taxRow.taxType,
    taxAmount: taxRow.taxAmount,
    currency: taxRow.currency,
    taxAuthority: taxRow.taxAuthority || null,
    taxPaidDate: taxRow.taxPaidDate || null,
    receiptReference: taxRow.receiptReference || null
  }));

  // Parse dateRegistration and timeRegistration
  const dateRegistration = row.dateRegistration;
  const timeRegistration = row.timeRegistration;

  return {
    lotNumber: row.lotNumber,
    dateRegistration: dateRegistration,
    timeRegistration: timeRegistration,
    creator: creator,
    mineral: row.mineral,
    concentration: row.concentration,
    mass: row.mass,
    packageType: row.packageType || null,
    nrOfPackages: row.nrOfPackages || null,
    unitOfMeasurement: row.unitOfMeasurement,
    mineSiteId: row.mineSiteId || null,
    miner: row.miner || null,
    creatorRole: creatorRoles,
    recipient: recipient || null,
    price: row.price,
    originatingOperation: originatingOperations,
    inputLot: inputLots,
    tag: tag || null,
    taxPaid: taxes,
    dateSealed: row.dateSealed || null,
    dateShipped: row.dateShipped || null,
    purchaseNumber: row.purchaseNumber || null,
    purchaseDate: row.purchaseDate || null,
    responsibleStaff: row.responsibleStaff || null,
    dateIn: row.dateIn || null,
    transportationMethod: row.transportationMethod || null,
    transportationRoute: row.transportationRoute || null,
    transportCompany: row.transportCompany || null,
    exportCertificateId: row.exportCertificateId || null
  };
}

class LotsService {
  list(filters = {}, page = 1, limit = 20) {
    let sql = 'SELECT * FROM lots WHERE 1=1';
    const conditions = [];
    const values = [];

    if (filters.mineSiteId) {
      conditions.push('mineSiteId = ?');
      values.push(filters.mineSiteId);
    }
    if (filters.mineral) {
      conditions.push('mineral = ?');
      values.push(filters.mineral);
    }
    if (filters.lotNumber) {
      conditions.push('lotNumber = ?');
      values.push(filters.lotNumber);
    }
    if (filters.dateRegistrationFrom) {
      conditions.push('dateRegistration >= ?');
      values.push(filters.dateRegistrationFrom);
    }
    if (filters.dateRegistrationTo) {
      conditions.push('dateRegistration <= ?');
      values.push(filters.dateRegistrationTo);
    }

    if (conditions.length > 0) {
      sql += ' AND ' + conditions.join(' AND ');
    }

    // Filter by creatorRole if specified
    if (filters.creatorRole) {
      const lotsWithRole = db.prepare(`
        SELECT DISTINCT lotNumber FROM lotCreatorRoles WHERE roleCode = ?
      `).all(filters.creatorRole).map(r => r.lotNumber);
      
      if (lotsWithRole.length > 0) {
        conditions.push('lotNumber IN (' + lotsWithRole.map(() => '?').join(',') + ')');
        values.push(...lotsWithRole);
      } else {
        // No lots match, return empty
        return {
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0, hasNext: false, hasPrevious: false }
        };
      }
    }

    // Filter by originatingOperation if specified
    if (filters.originatingOperation) {
      const lotsWithOp = db.prepare(`
        SELECT DISTINCT lotNumber FROM lotOriginatingOperations WHERE operationCode = ?
      `).all(filters.originatingOperation).map(r => r.lotNumber);
      
      if (lotsWithOp.length > 0) {
        if (!conditions.includes('lotNumber IN')) {
          conditions.push('lotNumber IN (' + lotsWithOp.map(() => '?').join(',') + ')');
          values.push(...lotsWithOp);
        } else {
          // Intersect with existing filter
          const existing = values.filter((v, i) => conditions[i]?.includes('lotNumber IN'));
          // Simplified: just use the more restrictive filter
        }
      } else {
        return {
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0, hasNext: false, hasPrevious: false }
        };
      }
    }

    const countSql = sql.replace(/SELECT \*/, 'SELECT COUNT(*) as total');
    const countStmt = db.prepare(countSql);
    const { total } = countStmt.get(...values);

    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    const stmt = db.prepare(sql);
    const rows = stmt.all(...values, limit, offset);

    return {
      data: rows.map(row => reconstructLot(row)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1
      }
    };
  }

  getById(lotNumber) {
    const row = db.prepare('SELECT * FROM lots WHERE lotNumber = ?').get(lotNumber);
    if (!row) {
      const error = new Error('Lot not found');
      error.code = 'NOT_FOUND';
      error.status = 404;
      throw error;
    }
    return reconstructLot(row);
  }

  create(data) {
    const validation = validator.validate(data, 'lot');
    if (!validation.valid) {
      const error = new Error('Validation failed');
      error.validation = true;
      error.errors = validation.errors;
      throw error;
    }

    const transaction = db.transaction(() => {
      // Ensure all business entities exist before inserting
      let creatorId;
      try {
        creatorId = insertOrGetBusinessEntity(data.creator);
        // Verify the entity was actually created/retrieved
        const verifyCreator = db.prepare('SELECT identifier FROM businessEntities WHERE identifier = ?').get(creatorId);
        if (!verifyCreator) {
          throw new Error(`Failed to create/retrieve creator business entity: ${creatorId}`);
        }
      } catch (error) {
        throw new Error(`Error creating creator business entity: ${error.message}`);
      }
      
      let recipientId = null;
      if (data.recipient) {
        try {
          recipientId = insertOrGetBusinessEntity(data.recipient);
          const verifyRecipient = db.prepare('SELECT identifier FROM businessEntities WHERE identifier = ?').get(recipientId);
          if (!verifyRecipient) {
            throw new Error(`Failed to create/retrieve recipient business entity: ${recipientId}`);
          }
        } catch (error) {
          throw new Error(`Error creating recipient business entity: ${error.message}`);
        }
      }
      
      let tagIssuerId = null;
      if (data.tag && data.tag.issuer) {
        try {
          tagIssuerId = insertOrGetBusinessEntity(data.tag.issuer);
          const verifyTagIssuer = db.prepare('SELECT identifier FROM businessEntities WHERE identifier = ?').get(tagIssuerId);
          if (!verifyTagIssuer) {
            throw new Error(`Failed to create/retrieve tag issuer business entity: ${tagIssuerId}`);
          }
        } catch (error) {
          throw new Error(`Error creating tag issuer business entity: ${error.message}`);
        }
      }

      // Insert tag if present
      if (data.tag) {
        if (!data.tag.issuer || !tagIssuerId) {
          const error = new Error('Tag issuer is required when tag is provided');
          error.code = 'VALIDATION_ERROR';
          throw error;
        }
        db.prepare(`
          INSERT OR IGNORE INTO tags (identifier, issuerId, issueDate, issueTime, representativeRMB, tagType)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          data.tag.identifier,
          tagIssuerId,
          data.tag.issueDate,
          data.tag.issueTime || null,
          data.tag.representativeRMB,
          data.tag.tagType || null
        );
      }
      
      // Validate mineSiteId exists if provided
      if (data.mineSiteId) {
        const mineSite = db.prepare('SELECT icglrId FROM mineSites WHERE icglrId = ?').get(data.mineSiteId);
        if (!mineSite) {
          const error = new Error(`Mine site with ID ${data.mineSiteId} does not exist`);
          error.code = 'VALIDATION_ERROR';
          throw error;
        }
      }
      
      // Validate exportCertificateId exists if provided
      if (data.exportCertificateId) {
        const exportCert = db.prepare('SELECT exportCertificateId FROM exportCertificates WHERE exportCertificateId = ?').get(data.exportCertificateId);
        if (!exportCert) {
          const error = new Error(`Export certificate with ID ${data.exportCertificateId} does not exist`);
          error.code = 'VALIDATION_ERROR';
          throw error;
        }
      }

      // Insert taxes if present
      const taxIds = [];
      if (data.taxPaid && data.taxPaid.length > 0) {
        const insertTax = db.prepare(`
          INSERT INTO taxes (taxType, taxAmount, currency, taxAuthority, taxPaidDate, receiptReference) VALUES (?, ?, ?, ?, ?, ?)
        `);
        data.taxPaid.forEach(tax => {
          const result = insertTax.run(
            tax.taxType, 
            tax.taxAmount, 
            tax.currency,
            tax.taxAuthority || null,
            tax.taxPaidDate || null,
            tax.receiptReference || null
          );
          taxIds.push(result.lastInsertRowid);
        });
      }

      // Insert lot (using dateRegistration and timeRegistration directly)
      try {
        const prep = db.prepare(`
          INSERT INTO lots 
          (lotNumber, dateRegistration, timeRegistration, creatorId, mineral, concentration, mass, packageType,
           unitOfMeasurement, mineSiteId, miner, recipientId, price, tagIdentifier, tagIssuerId,
           tagIssueDate, tagIssueTime, tagRepresentativeRMB, tagTagType, dateSealed, dateShipped, purchaseNumber, purchaseDate,
           responsibleStaff, dateIn, transportationMethod, transportationRoute,
           transportCompany, exportCertificateId, nrOfPackages)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        prep.run(
          data.lotNumber,
          data.dateRegistration,
          data.timeRegistration,
          creatorId,
          data.mineral,
          data.concentration,
          data.mass,
          data.packageType || null,
          data.unitOfMeasurement,
          data.mineSiteId || null,
          data.miner || null,
          recipientId,
          data.price,
          data.tag?.identifier || null,
          tagIssuerId,
          data.tag?.issueDate || null,
          data.tag?.issueTime || null,
          data.tag?.representativeRMB || null,
          data.tag?.tagType || null,
          data.dateSealed || null,
          data.dateShipped || null,
          data.purchaseNumber || null,
          data.purchaseDate || null,
          data.responsibleStaff || null,
          data.dateIn || null,
          data.transportationMethod || null,
          data.transportationRoute || null,
          data.transportCompany || null,
          data.exportCertificateId || null,
          data.nrOfPackages || null
        );
      } catch (error) {
        console.error('Error inserting lot:', error);
        throw error;
      }

      // Insert creator roles
      if (data.creatorRole && data.creatorRole.length > 0) {
        const insertRole = db.prepare(`
          INSERT INTO lotCreatorRoles (lotNumber, roleCode) VALUES (?, ?)
        `);
        data.creatorRole.forEach(role => {
          insertRole.run(data.lotNumber, role);
        });
      }

      // Insert originating operations
      if (data.originatingOperation && data.originatingOperation.length > 0) {
        const insertOp = db.prepare(`
          INSERT INTO lotOriginatingOperations (lotNumber, operationCode) VALUES (?, ?)
        `);
        data.originatingOperation.forEach(op => {
          insertOp.run(data.lotNumber, op);
        });
      }

      // Insert input lots
      if (data.inputLot && data.inputLot.length > 0) {
        const insertInput = db.prepare(`
          INSERT INTO lotInputLots (lotNumber, inputLotNumber) VALUES (?, ?)
        `);
        data.inputLot.forEach(input => {
          insertInput.run(data.lotNumber, input.lotNumber);
        });
      }

      // Link taxes
      if (taxIds.length > 0) {
        const linkTax = db.prepare(`
          INSERT INTO lotTaxes (lotNumber, taxId) VALUES (?, ?)
        `);
        taxIds.forEach(taxId => {
          linkTax.run(data.lotNumber, taxId);
        });
      }
    });

    transaction();

    return this.getById(data.lotNumber);
  }
}

module.exports = new LotsService();

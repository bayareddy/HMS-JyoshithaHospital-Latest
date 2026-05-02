const db = require('../config/db');

// Get all patients
const getPatients = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.frist_name as name,
        p.age,
        p.gender,
        p.diagnosis,
        p.blood_group as blood,
        p.status,
        p.admission_date,
        p.phone_no as phoneNo,
        p.emergency_contact as emergencyContact,
        p.allergies,
        p.relationship_type as relationshipType,
        p.relationship,
        p.whatsapp_no as whatsappNo,
        p.email_id as emailId,
        p.address,
        p.pin_code as pinCode,
        p.city,
        p.state_id as stateId,
        s.name as state_name
      FROM patients p 
      LEFT JOIN states s ON p.state_id = s.id
      ORDER BY p.id DESC
    `);
    const formatted = rows.map(row => ({
      id: `P-${row.id}`,
      name: row.name,
      age: row.age,
      gender: row.gender || '',
      ward: '',
      doctor: '',
      diagnosis: row.diagnosis || '',
      blood: row.blood || '',
      status: row.status || 'stable',
      date: row.admission_date ? new Date(row.admission_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      phoneNo: row.phoneNo,
      emergencyContact: row.emergencyContact,
      allergies: row.allergies,
      relationshipType: row.relationshipType,
      relationship: row.relationship,
      whatsappNo: row.whatsappNo,
      emailId: row.emailId,
      address: row.address,
      pinCode: row.pinCode,
      city: row.city,
      stateId: row.stateId
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new patient
const createPatient = async (req, res) => {
  const { 
    name, age, gender, diagnosis, blood, status,
    phoneNo, emergencyContact, allergies, relationshipType, relationship,
    whatsappNo, emailId, address, pinCode, city, stateId
  } = req.body;
  try {
    const parseNum = (val) => {
      if (typeof val === 'number' && !isNaN(val)) return val;
      if (typeof val === 'string' && val.trim() !== '' && !isNaN(parseInt(val))) return parseInt(val);
      return null;
    };
    const ageNum = parseNum(age);
    const pinCodeNum = parseNum(pinCode);
    const stateIdNum = parseNum(stateId);
    
    const [result] = await db.query(
      `INSERT INTO patients (
        frist_name, age, gender, diagnosis, blood_group, status, admission_date,
        phone_no, emergency_contact, allergies, relationship_type, relationship,
        whatsapp_no, email_id, address, pin_code, city, state_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        ageNum,
        gender || null,
        diagnosis || null,
        blood || null,
        status || 'admitted',
        new Date(),
        phoneNo || null,
        emergencyContact || null,
        allergies || null,
        relationshipType || null,
        relationship || null,
        whatsappNo || null,
        emailId || null,
        address || null,
        pinCodeNum,
        city || null,
        stateIdNum
      ]
    );
    const patientId = result.insertId;
    res.status(201).json({ 
      id: `P-${patientId}`, 
      name, 
      age: ageNum, 
      gender: gender || '', 
      ward: '', 
      doctor: '', 
      diagnosis: diagnosis || '', 
      blood: blood || '', 
      status: status || 'admitted', 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      phoneNo,
      emergencyContact,
      allergies,
      relationshipType,
      relationship,
      whatsappNo,
      emailId,
      address,
      pinCode,
      city,
      stateId
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update a patient
const updatePatient = async (req, res) => {
  const patientId = parseInt(req.params.id, 10);
  if (isNaN(patientId)) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }
  
  const { 
    name, age, gender, diagnosis, blood, status,
    phoneNo, emergencyContact, allergies, relationshipType, relationship,
    whatsappNo, emailId, address, pinCode, city, stateId
  } = req.body;
  
  try {
    const parseNum = (val) => {
      if (typeof val === 'number' && !isNaN(val)) return val;
      if (typeof val === 'string' && val.trim() !== '' && !isNaN(parseInt(val))) return parseInt(val);
      return null;
    };
    const ageNum = parseNum(age);
    const pinCodeNum = parseNum(pinCode);
    const stateIdNum = parseNum(stateId);
    
    const [result] = await db.query(
      `UPDATE patients SET 
        frist_name = ?, age = ?, gender = ?, diagnosis = ?, blood_group = ?, status = ?,
        phone_no = ?, emergency_contact = ?, allergies = ?, relationship_type = ?, relationship = ?,
        whatsapp_no = ?, email_id = ?, address = ?, pin_code = ?, city = ?, state_id = ?
       WHERE id = ?`,
      [
        name,
        ageNum,
        gender || null,
        diagnosis || null,
        blood || null,
        status || 'admitted',
        phoneNo || null,
        emergencyContact || null,
        allergies || null,
        relationshipType || null,
        relationship || null,
        whatsappNo || null,
        emailId || null,
        address || null,
        pinCodeNum,
        city || null,
        stateIdNum,
        patientId
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Fetch updated patient
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.frist_name as name,
        p.age,
        p.gender,
        p.diagnosis,
        p.blood_group as blood,
        p.status,
        p.admission_date,
        p.phone_no as phoneNo,
        p.emergency_contact as emergencyContact,
        p.allergies,
        p.relationship_type as relationshipType,
        p.relationship,
        p.whatsapp_no as whatsappNo,
        p.email_id as emailId,
        p.address,
        p.pin_code as pinCode,
        p.city,
        p.state_id as stateId
      FROM patients p 
      WHERE p.id = ?
    `, [patientId]);
    
    const row = rows[0];
    const updatedPatient = {
      id: `P-${row.id}`,
      name: row.name,
      age: row.age,
      gender: row.gender || '',
      ward: '',
      doctor: '',
      diagnosis: row.diagnosis || '',
      blood: row.blood || '',
      status: row.status || 'stable',
      date: row.admission_date ? new Date(row.admission_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      phoneNo: row.phoneNo,
      emergencyContact: row.emergencyContact,
      allergies: row.allergies,
      relationshipType: row.relationshipType,
      relationship: row.relationship,
      whatsappNo: row.whatsappNo,
      emailId: row.emailId,
      address: row.address,
      pinCode: row.pinCode,
      city: row.city,
      stateId: row.stateId
    };
    
    res.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getPatients, createPatient, updatePatient };

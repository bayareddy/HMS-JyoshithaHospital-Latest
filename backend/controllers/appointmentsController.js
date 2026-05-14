const db = require('../config/db');

// Get all appointments with joins
const getAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.*,
        p.frist_name as patient_name,
        p.phone_no as patient_phone,
        s.name as doctor_name,
        s.department_id as doctor_department_id,
        d.name as department_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN staff s ON a.doctor_id = s.id
      LEFT JOIN departments d ON s.department_id = d.id
      ORDER BY a.id DESC
    `);
    const formatted = rows.map(row => {
      const appointmentDate = new Date(row.appointment_time);
      const localDate = new Date(appointmentDate.getTime() - appointmentDate.getTimezoneOffset() * 60000);
      return {
        id: row.id,
        patientId: row.patient_id || null,
        time: row.appointment_time ? appointmentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
        date: row.appointment_time ? localDate.toISOString().split('T')[0] : '',
        patient: row.p_name || row.patient_name || 'Unknown',
        phoneNo: row.phone_no || row.patient_phone || '',
        doctor: row.doctor_name || 'Unknown',
        type: row.type || '',
        reason: row.type || '',
        department: row.department_name || '',
        status: row.status || 'scheduled'
      };
    });
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new appointment
const createAppointment = async (req, res) => {
  const { appointment_time, doctor_id, type, status, p_name, patient_id, phone_no } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO appointments (appointment_time, patient_id, doctor_id, type, status, p_name, phone_no) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [appointment_time, patient_id, doctor_id, type, status || 'scheduled', p_name || null, phone_no || null]
    );
    // Fetch the created appointment
    const [rows] = await db.query(`
      SELECT 
        a.*,
        p.frist_name as patient_name,
        p.phone_no as patient_phone,
        s.name as doctor_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN staff s ON a.doctor_id = s.id
      WHERE a.id = ?
    `, [result.insertId]);
    
    const row = rows[0];
    const appointmentDate = new Date(row.appointment_time);
    const localDate = new Date(appointmentDate.getTime() - appointmentDate.getTimezoneOffset() * 60000);
    res.status(201).json({
      id: row.id,
      patientId: row.patient_id || null,
      time: row.appointment_time ? appointmentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
      date: row.appointment_time ? localDate.toISOString().split('T')[0] : '',
      patient: row.p_name || row.patient_name || 'Unknown',
      phoneNo: row.phone_no || row.patient_phone || '',
      doctor: row.doctor_name || 'Unknown',
      type: row.type || '',
      department: '',
      status: row.status || 'scheduled'
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update an appointment
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { appointment_time, doctor_id, type, p_name, phone_no } = req.body;
  try {
    await db.query(
      'UPDATE appointments SET appointment_time = ?, doctor_id = ?, type = ?, p_name = ?, phone_no = ? WHERE id = ?',
      [appointment_time, doctor_id, type, p_name, phone_no || null, id]
    );
    // Fetch the updated appointment
    const [rows] = await db.query(`
      SELECT 
        a.*,
        p.frist_name as patient_name,
        p.phone_no as patient_phone,
        s.name as doctor_name,
        s.department_id as doctor_department_id,
        d.name as department_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN staff s ON a.doctor_id = s.id
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE a.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    const row = rows[0];
    const appointmentDate = new Date(row.appointment_time);
    const localDate = new Date(appointmentDate.getTime() - appointmentDate.getTimezoneOffset() * 60000);
    res.json({
      id: row.id,
      patientId: row.patient_id || null,
      time: row.appointment_time ? appointmentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
      date: row.appointment_time ? localDate.toISOString().split('T')[0] : '',
      patient: row.p_name || row.patient_name || 'Unknown',
      phoneNo: row.phone_no || row.patient_phone || '',
      doctor: row.doctor_name || 'Unknown',
      type: row.type || '',
      department: row.department_name || '',
      status: row.status || 'scheduled'
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: error.message });
  }
};

const getSlots = async (req, res) => {
  const { doctorId, date } = req.query;
  
  if (!doctorId || !date) {
    return res.status(400).json({ error: 'doctorId and date are required' });
  }

  try {
    // 1. Get shift ID and shift details for the doctor
    const [staffRows] = await db.query(`
      SELECT s.shift_id, sh.schedule, sh.opd_slot_time 
      FROM staff s 
      LEFT JOIN shifts sh ON s.shift_id = sh.id 
      WHERE s.id = ? AND s.is_active = 1
    `, [doctorId]);

    if (staffRows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found or inactive' });
    }

    const { schedule, opd_slot_time } = staffRows[0];
    
    if (!schedule) {
      return res.json({ slots: [] });
    }

    // Parse the date to get the day of the week
    const targetDate = new Date(date);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDayName = days[targetDate.getDay()];

    let parsedSchedule;
    try {
      parsedSchedule = typeof schedule === 'string' ? JSON.parse(schedule) : schedule;
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse doctor schedule' });
    }

    const daySchedule = parsedSchedule.find(d => d.day === targetDayName);
    if (!daySchedule || !daySchedule.tasks || daySchedule.tasks.length === 0) {
      return res.json({ slots: [] }); // No slots for this day
    }

    // 2. Generate all possible slots based on the schedule
    const allSlots = [];
    const slotDurationMs = (opd_slot_time || 15) * 60000;

    for (const task of daySchedule.tasks) {
      if (!task.fromTime || !task.toTime) continue;
      
      const [fromHour, fromMin] = task.fromTime.split(':').map(Number);
      const [toHour, toMin] = task.toTime.split(':').map(Number);
      
      let currentStartTime = new Date(targetDate);
      currentStartTime.setHours(fromHour, fromMin, 0, 0);
      
      const endTime = new Date(targetDate);
      endTime.setHours(toHour, toMin, 0, 0);

      while (currentStartTime.getTime() + slotDurationMs <= endTime.getTime()) {
        const timeStr = currentStartTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        // Also formatted for display AM/PM
        const displayTime = currentStartTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        allSlots.push({
          time: timeStr.substring(0, 5), // "14:30"
          displayTime,
          isAvailable: true
        });
        currentStartTime = new Date(currentStartTime.getTime() + slotDurationMs);
      }
    }

    // 3. Get existing appointments to filter booked slots
    const startOfDay = `${date} 00:00:00`;
    const endOfDay = `${date} 23:59:59`;
    
    const [appointments] = await db.query(`
      SELECT appointment_time 
      FROM appointments 
      WHERE doctor_id = ? 
      AND appointment_time >= ? 
      AND appointment_time <= ?
      AND status != 'cancelled'
    `, [doctorId, startOfDay, endOfDay]);

    // Format booked times (e.g. '14:30')
    const bookedTimes = appointments.map(apt => {
      const aptDate = new Date(apt.appointment_time);
      // toLocaleTimeString ('14:30')
      return aptDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).substring(0, 5);
    });

    // Mark slots as booked
    const slots = allSlots.map(slot => {
      if (bookedTimes.includes(slot.time)) {
        slot.isAvailable = false;
      }
      return slot;
    });

    // Remove duplicates if tasks overlapped
    const uniqueSlots = Array.from(new Map(slots.map(s => [s.time, s])).values());
    
    // Sort by time
    uniqueSlots.sort((a, b) => a.time.localeCompare(b.time));

    // 4. Filter past slots for the current date in IST
    const todayNum = new Date();
    const istOptions = { 
      timeZone: 'Asia/Kolkata', 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit', hour12: false 
    };
    const istParts = new Intl.DateTimeFormat('en-US', istOptions).formatToParts(todayNum);
    const istMap = {};
    istParts.forEach(({ type, value }) => istMap[type] = value);
    
    // JS dates can give hour 24 for midnight, formatting to 00
    const istHour = istMap.hour === '24' ? '00' : istMap.hour;
    const currentIstDate = `${istMap.year}-${istMap.month}-${istMap.day}`;
    const currentIstTime = `${istHour}:${istMap.minute}`;

    let validSlots = uniqueSlots;
    if (date === currentIstDate) {
      validSlots = uniqueSlots.filter(slot => slot.time >= currentIstTime);
    } else if (date < currentIstDate) {
      validSlots = [];
    }

    res.json({ slots: validSlots });
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAppointments, createAppointment, updateAppointment, getSlots };
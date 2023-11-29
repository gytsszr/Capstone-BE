const { users, batchs, applyments  } = require('../../models'); // Ganti dengan path yang benar ke file models/users.js
const CryptoJS = require("crypto-js");

const key = "Jobsterific102723"; // Ganti dengan kunci rahasia Anda

const encryptData = (data, key) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

const decryptData = (ciphertext, key) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Ambil data admin dari database
const getAdmin = async () => {
    try {
        const adminData = await users.findAll({
            where: {
                isAdmin: true,
            },
           attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt'],
        });
        return adminData;
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        throw err;
    }
};


/////////////////////////////////////////////////////////////////////////////////////
const registerAdmin = async (req, h) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      sex,
      address,
    } = req.payload;

    // Validasi data
    if (!email.includes("@")) {
      return h.response({ error: "Email tidak valid" }).code(400);
    }

    if (password.length < 8) {
      return h.response({ error: "Password harus lebih dari 8 karakter" }).code(400);
    }

    // Membuat admin baru
    const newAdmin = await users.create({
      firstName,
      lastName,
      email,
      password,
      sex,
      address,
      isAdmin: true,
    });

    // Mengembalikan pesan sukses
    return h.response({ message: "Admin berhasil dibuat" }).code(201);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    
    // Mengembalikan pesan kesalahan internal server error
    return h.response({ error: "Terjadi kesalahan internal server" }).code(500);
  }
};

//////////////////////////////////////////////////////////////////////////////////////
// Endpoint POST /api/admins/login (Login Admin)

const loginAdmin = async (req, h) => {
  const { email, password } = req.payload;

  try {
    // Mencari admin di database berdasarkan email dan password
    const admin = await users.findOne({
      where: {
        email: email,
        password: password,
        isAdmin: true,
      }
    });

    if (!admin) {
      return h.response({ message: 'Invalid email or password' }).code(400);
    }

    // Mengenkripsi data admin
    const key = 'Jobsterific102723';
    const encryptedData = encryptData({
      email: admin.email,
      password: admin.password,
      firstName: admin.firstName
    }, key);

    // Menyimpan token ke database
    admin.token = encryptedData;
    await admin.save();

    // Mengembalikan data terenkripsi
    return h.response({ message: 'Success Login', admin }).code(200);
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    return h.response({ message: 'Invalid email or password' }).code(400);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Endpoint GET /api/admins/customers (Get All Customers)

const AdmingetCustomers = async (request, h) => {
    const token = request.headers['token'];

    try {
        const key = 'Jobsterific102723';
        const adminData = decryptData(token, key);

        // Periksa admin
        if (!adminData || !adminData.isAdmin) {
            return h.response({ message: 'Unauthorized' }).code(401);
        }

        // Mengambil data customer
        const customers = await users.findAll({
            where: { isCustomer: true },
            attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt'],
        });

        // Mengembalikan data customer yang sudah di-dekripsi
        const decryptedCustomers = customers.map(customer => {
            return {
                id: customer.id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                createdAt: customer.createdAt,
                updatedAt: customer.updatedAt,
                // Tambahkan data tambahan jika diperlukan
            };
        });

        return h.response(decryptedCustomers).code(200);
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        return h.response({ message: 'Validation Error', err }).code(400);
    }
};
//////////////////////////////////////

const logoutAdmin = async (request, h) => {
  try {
    const token = request.headers['token'];

    // Periksa apakah token diberikan
    if (!token) {
      return h.response({ message: 'Token is missing' }).code(400);
    }

    // Dekripsi token untuk mendapatkan data admin
    const key = 'Jobsterific102723';
    const adminData = decryptData(token, key);

    // Periksa apakah admin ditemukan
    if (!adminData || !adminData.isAdmin) {
      return h.response({ message: 'Unauthorized' }).code(401);
    }

    // Temukan admin di database berdasarkan email
    const admin = await users.findOne({
      where: {
        email: adminData.email,
        isAdmin: true,
      },
    });

    // Hapus token dari admin di database
    admin.token = null;
    await admin.save();

    return h.response({ message: 'Logout success' }).code(200);
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    return h.response({ message: 'Validation Error', err }).code(400);
  }
};


/////////////////////////////////////////////////
    const registerBatch = async (req, h) => {
  try {
    const token = req.headers['token']; // Ganti sesuai dengan kebutuhan Anda
    const adminData = decryptData(token, key);

    // Periksa admin
    if (!adminData || !adminData.isAdmin) {
      return h.response({ message: 'Unauthorized' }).code(401);
    }

    const {
      name,
      start_date,
      end_date,
      status,
    } = req.payload;

    // Validasi parameter status
    if (!["open", "closed", "processed"].includes(status)) {
      return h.response({ error: "`open`, `closed`, atau `processed`" }).code(400);
    }

    // Cek apakah user dengan UserId dari admin valid
    const adminUser = await users.findOne({
      where: { id: adminData.userId, isAdmin: true },
    });

    if (!adminUser) {
      return h.response({ message: 'Unauthorized' }).code(401);
    }

    // Buat batch baru
    const newBatch = await batchs.create({
      UserId: adminData.userId, // Set UserId dari admin yang membuat batch
      CampaignName: name,
      CampaignPeriod: start_date,
      status,
      startDate: start_date,
      endDate: end_date,
    });

    return h.response({ message: "Batch berhasil ditambahkan", batch: newBatch }).code(201);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    return h.response({ message: 'Validation Error', err }).code(400);
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint GET /api/admins/applyments (Get All Applications)

const getApplyments = async (req, h) => {
  try {
    const token = decryptData(req.headers["Authorization"], key);
    const admin = await users.findOne({
      where: { token },
    });

    if (!admin) {
      return h.status(401).json({ error: "Token tidak valid" });
    }

    const page = req.query.page || 1;
    const per_page = req.query.per_page || 10;

    const applyments = await Applyment.findAll({
      where: { isProcessed: false },
      orderBy: {
        createdAt: "desc",
      },
      limit: per_page,
      offset: (page - 1) * per_page,
    });

    return h.response(applyments).code(200);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    throw err;
  }
};

// Endpoint GET /api/admins/applyments/:applyId (Get Application)

const getApplyment = async (req, h) => {
  try {
    const token = decryptData(req.headers["Authorization"], key);
    const admin = await users.findOne({
      where: { token },
    });

    if (!admin) {
      return h.status(401).json({ error: "Token tidak valid" });
    }

    const applyId = req.params.applyId;

    const applyment = await Applyment.findOne({
      where: { id: applyId },
    });

    if (!applyment) {
      return h.status(404).json({ error: "Lamaran kerja tidak ditemukan" });
    }

    return h.response(applyment).code(200);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    throw err;
  }
};

// Endpoint GET /api/admins/candidates (Get All Candidates)

const AdmingetCandidates = async (req, h) => {
  try {
    const token = decryptData(req.headers["Authorization"], key);
    const admin = await users.findOne({
      where: { token },
    });

    if (!admin) {
      return h.status(401).json({ error: "Token tidak valid" });
    }

    const page = req.query.page || 1;
    const per_page = req.query.per_page || 10;

    const candidates = await users.findAll({
      where: { isCustomer: false },
      orderBy: {
        firstName: "asc",
      },
      limit: per_page,
      offset: (page - 1) * per_page,
    });

    return h.response(candidates).code(200);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    throw err;
  }
};

// Endpoint PUT /api/admins/candidates/{candidateId} (Update Candidate)

const AdminupdateCandidate = async (req, h) => {
  try {
    const token = decryptData(req.headers["Authorization"], key);
    const admin = await users.findOne({
      where: { token },
    });

    if (!admin) {
      return h.status(401).json({ error: "Token tidak valid" });
    }

    const candidateId = req.params.candidateId;
    const {
      firstName,
      lastName,
      email,
      job,
      address,
    } = req.body;

    await users.update(
      {
        firstName,
        lastName,
        email,
        job,
        address,
      },
      { where: { id: candidateId } }
    );

    return h.response({ message: "Data kandidat berhasil diperbarui" }).code(200);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    throw err;
  }
};

// Endpoint PUT /api/admins/candidates/password/{candidateId} (Update Candidate Password)

const AdminupdateCandidatePassword = async (req, h) => {
  try {
    const token = decryptData(req.headers["Authorization"], key);
    const admin = await users.findOne({
      where: { token },
    });

    if (!admin) {
      return h.status(401).json({ error: "Token tidak valid" });
    }

    const candidateId = req.params.candidateId;
    const { password } = req.body;

    // Validasi password
    if (password.length < 6) {
      return h.status(400).json({ error: "Password harus lebih dari 6 karakter" });
    }

    await users.update(
      {
        password,
      },
      { where: { id: candidateId } }
    );

    return h.response({ message: "Password kandidat berhasil diperbarui" }).code(200);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    throw err;
  }
};

// Endpoint PUT /api/admins/candidates/status/{candidateId} (Update Candidate Status)

const AdminupdateCandidateStatus = async (req, h) => {
  try {
    const token = decryptData(req.headers["Authorization"], key);
    const admin = await users.findOne({
      where: { token },
    });

    if (!admin) {
      return h.status(401).json({ error: "Token tidak valid" });
    }

    const candidateId = req.params.candidateId;
    const { status } = req.body;

    await users.update(
      {
        status,
      },
      { where: { id: candidateId } }
    );

    return h.response({ message: "Status kandidat berhasil diperbarui" }).code(200);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    throw err;
  }
};

// Endpoint DELETE /api/admins/candidates/{candidateId} (Delete Candidate)

const AdmindeleteCandidate = async (req, h) => {
  try {
    const token = decryptData(req.headers["Authorization"], key);
    const admin = await users.findOne({
      where: { token },
    });

    if (!admin) {
      return h.status(401).json({ error: "Token tidak valid" });
    }

    const candidateId = req.params.candidateId;

    await users.destroy({
      where: { id: candidateId },
    });

    return h.response({ message: "Kandidat berhasil dihapus" }).code(200);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    throw err;
  }
};

// Endpoint POST /api/admins/customers (Create Customer)

const AdmincreateCustomer = async (req, h) => {
  try {
    const token = decryptData(req.headers["Authorization"], key);
    const admin = await users.findOne({
      where: { token },
    });

    if (!admin) {
      return h.status(401).json({ error: "Token tidak valid" });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      address,
    } = req.body;

    // Validasi data
    if (!email.includes("@")) {
      return h.status(400).json({ error: "Email tidak valid" });
    }

    if (password.length < 6) {
      return h.status(400).json({ error: "Password harus lebih dari 6 karakter" });
    }

    const newCustomer = await users.create({
      firstName,
      lastName,
      email,
      password,
      address,
      isCustomer: true,
    });

    return h.response(newCustomer).code(201);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    throw err;
  }
};

// Endpoint PUT /api/admins/customers/{customerId} (Update Customer)

const AdminupdateCustomer = async (req, h) => {
  try {
    const token = decryptData(req.headers["Authorization"], key);
    const admin = await users.findOne({
      where: { token },
    });

    if (!admin) {
      return h.status(401).json({ error: "Token tidak valid" });
    }

    const customerId = req.params.customerId;
    const {
      firstName,
      lastName,
      email,
      password,
      address,
    } = req.body;

    await users.update(
      {
        firstName,
        lastName,
        email,
        password,
        address,
      },
      { where: { id: customerId } }
    );

    return h.response({ message: "Data Candicate berhasil diperbarui" }).code(200);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    throw err;
  }
};

// Endpoint DELETE /api/admins/customers/{customerId} (Delete Customer)

const AdmindeleteCustomer = async (req, h) => {
  try {
    const token = decryptData(req.headers["Authorization"], key);
    const admin = await users.findOne({
      where: { token },
    });

    if (!admin) {
      return h.status(401).json({ error: "Token tidak valid" });
    }

    const customerId = req.params.customerId;

    await users.destroy({
      where: { id: customerId, isCustomer: true },
    });

    return h.response({ message: "Customer berhasil dihapus" }).code(200);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    throw err;
  }
};

module.exports = {
  getAdmin,
  registerAdmin,
  loginAdmin,
  AdmingetCustomers,
  registerBatch,
  getApplyments,
  getApplyment,
  logoutAdmin,
  AdmindeleteCandidate,
  AdmincreateCustomer,
  AdminupdateCustomer,
  AdmindeleteCustomer,
  AdmingetCandidates,
  AdminupdateCandidate,
  AdminupdateCandidatePassword,
  AdminupdateCandidateStatus,
};

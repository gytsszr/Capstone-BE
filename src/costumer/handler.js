const { users, batchs, applyments, resumes } = require('../../models');
const CryptoJS = require('crypto-js');

// Fungsi untuk mengenkripsi data menggunakan AES
const encryptData = (data, key) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

// Fungsi untuk mendekripsi data menggunakan AES
const decryptData = (ciphertext, key) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Fungsi untuk mengambil data customer dari database
const getCustomer = async () => {
    try {
        const customersData = await users.findAll({
            where: { isCustomer: true },
            order: [
                ['firstName', 'ASC'],
            ],
        });
        return customersData;
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        throw err;
    }
};

// Fungsi untuk mendaftarkan customer baru
const registerCustomer = async (req, h) => {
    const {
        firstName,
        lastName,
        email,
        password,
        phone,
        sex,
        address,
        website,
        description,
    } = req.payload;

    try {
        // Membuat customer baru dengan isCustomer default sebagai true
        const newCustomer = await users.create({
            firstName,
            lastName,
            email,
            password,
            phone,
            sex,
            address,
            website,
            description,
            isCustomer: true,
        });

        // Validasi data
        if (!email.includes("@")) {
            return h.response({ error: "Email tidak valid" }).code(400);
        }

        if (password.length < 8) {
            return h.response({ error: "Password harus lebih dari 8 karakter" }).code(400);
        }

        // Mengembalikan data customer yang baru dibuat
        return newCustomer;
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        throw err;
    }
};

// Fungsi untuk login customer
const loginCustomer = async (req, h) => {
    const {
        email,
        password,
    } = req.payload;

    try {
        // Mencari customer di database berdasarkan email dan password
        const customer = await users.findOne({
            where: {
                email: email,
                password: password,
            }
        });

        if (!customer) {
            return h.response({ message: 'Invalid email or password' }).code(400);
        }

        // Mengenkripsi data customer
        const key = 'Jobsterific102723';
        const encryptedData = encryptData({
            email: customer.email,
            password: customer.password,
            firstName: customer.firstName
        }, key);

        // Menyimpan token ke database
        customer.token = encryptedData;
        await customer.save();

        // Mengembalikan data terenkripsi
        return h.response({ message: 'Success Login', customer }).code(200);

    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        return h.response({ message: 'Validation Error' }).code(400);
    }
};

// Fungsi untuk mengambil data customer berdasarkan ID
const getCustomerById = async (req, h) => {
  // Mendapatkan token dari header request
  const token = req.headers['token'];

  try {
    // Mendecrypt token
    const key = 'Jobsterific102723';
    const customerData = decryptData(token, key);

    // Memeriksa apakah token valid
    if (!customerData || customerData.email === '') {
      return h.response({ message: 'Invalid token' }).code(401);
    }

    // Mencari customer berdasarkan ID customer
    const customer = await users.findOne({
      where: {
        id: customerData.id,
        isCustomer: true,
      },
    });

    // Jika customer tidak ditemukan, kirim respons 404
    if (!customer) {
      return h.response({ message: 'Customer not found' }).code(404);
    }

    // Jika customer ditemukan, kirim respons sukses dengan data customer
    return h.response({
      customer,
    }).code(200);

  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

// Fungsi untuk memperbarui data customer
const updateCustomer = async (req, h) => {
  // Extract token from request headers
  const token = req.headers['token'];

  // Extract customer data from request payload
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    sex,
    address,
    website,
    description,
  } = req.payload;

  try {
    // Decrypt token
    const key = 'Jobsterific102723';
    const customerData = decryptData(token, key);

    // Validate token
    if (!customerData || customerData.email === '') {
      return h.response({ message: 'Invalid token' }).code(401);
    }

    // Find customer based on token's email
    const customer = await users.findOne({
      where: {
        email: customerData.email
      }
    });

    // If customer not found, send 404 response
    if (!customer) {
      return h.response({ message: 'Customer not found' }).code(404);
    }

    // Update customer data
     customer.firstName = firstName;
     customer.lastName = lastName;
     customer.email = email;
     customer.password = password;
     customer.phone = phone;
     customer.sex = sex;
     customer.address = address;
     customer.website = website;
     customer.description = description;

    // Save updated customer data
    await customer.save();

    // Send successful update response with updated customer data
    return h.response({ message: 'Success Update', customer }).code(200);
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

// Fungsi untuk mengambil resume yang berasal dari user
const getResumeBatch = async (req, h) => {
  try {
    // Mendapatkan token dari header request
    const token = req.headers["token"];

    // Validasi token secara menyeluruh
    if (!verifyToken(token, "Jobsterific102723")) {
      return h.response({ error: "Token tidak valid" }).code(401);
    }

    // Mendapatkan ID user dari token
    const user_id = await getUser(token);

    if (!user_id) {
      return h.response({ error: "User tidak valid" }).code(401);
    }

    // Mencari resume berdasarkan ID user
    const resume = await resumes.findOne({
      where: { user_id: user_id },
    });

    if (!resume) {
      return h.response({ error: "Resume tidak ditemukan" }).code(404);
    }

    return h.response(resume).code(200);
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    throw err;
  }
};

// Fungsi untuk mengajukan lamaran ke suatu batch
const applyBatch = async (req, h) => {
  try {
    // Mendapatkan token dari header request
    const token = req.headers["token"];

    // Mencari customer berdasarkan token dan isCustomer
    const customer = await users.findOne({
      where: { token, isCustomer: true },
    });

    if (!customer) {
      return h.response({ error: "Customer tidak valid" }).code(401);
    }

    // Mendapatkan ID batch dari parameter route
    const batchId = req.params.batchId;

    // Mencari batch berdasarkan ID
    const batch = await batchs.findOne({
      where: { id: batchId },
    });

    if (!batch) {
      return h.response({ error: "Batch tidak ditemukan" }).code(404);
    }

    // Memeriksa apakah status batch masih "open"
    if (batch.status !== "open") {
      return h.response({ error: "Batch sudah ditutup" }).code(400);
    }

    // Membuat entri applyment baru
    const applyment = await applyments.create({
      userId: customer.id,
      batchid: batch.id,
      status: "pending",
    });

    return h.response({ message: "Lamaran berhasil diajukan" }).code(201);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    throw err;
  }
};

// Fungsi untuk melakukan logout customer
const customerLogout = async (req, h) => {
    const token = req.headers['token'];

    try {
        // Mencari customer berdasarkan token
        const customer = await users.findOne({
            where: {
                token: token
            }
        });

        if (!customer) {
            return h.response({ message: 'Validation Error' }).code(400);
        }

        // Menghapus token dari database
        customer.token = null;
        await customer.save();

        return h.response({ message: 'Success LogOut' }).code(200);
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        return h.response({ message: 'Validation Error', err }).code(400);
    }
}

module.exports = {
    getCustomer,
    registerCustomer,
    loginCustomer,
    getCustomerById,
    updateCustomer,
    getResumeBatch,
    applyBatch,
    customerLogout,
};

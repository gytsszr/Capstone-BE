const { users, Batch, Applyment } = require('./handler');
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
        job,
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
            job,
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
    const token = req.headers['token'];
    const userId = req.params.id_customer;

    try {
        // Mendekripsi token untuk mendapatkan data customer
        const key = 'Jobsterific102723'; // Ganti dengan kunci rahasia Anda
        const customerData = decryptData(token, key);
        
        // Mencari customer di database berdasarkan ID
        const customer = await users.findByPk(userId);

        if (!customer) {
            return h.response({ error: "Customer not found" }).code(404);
        }

        return customer;
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        throw err;
    }
};

// Fungsi untuk memperbarui data customer
const updateCustomer = async (req, h) => {
    const userId = req.params.id_customer;

    try {
        // Mencari customer di database berdasarkan ID
        const customer = await users.findByPk(userId);

        if (!customer) {
            return h.response({ error: "Customer not found" }).code(404);
        }

        // Mendapatkan data yang perlu diperbarui dari request payload
        const {
            firstName,
            lastName,
            email,
            password,
            phone,
            job,
            sex,
            address,
            website,
            description,
        } = req.payload;

        // Memperbarui data customer
        customer.firstName = firstName;
        customer.lastName = lastName;
        customer.email = email;
        customer.password = password;
        customer.phone = phone;
        customer.job = job;
        customer.sex = sex;
        customer.address = address;
        customer.website = website;
        customer.description = description;

        // Menyimpan perubahan ke database
        await customer.save();

        return customer;
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        throw err;
    }
};

// Fungsi untuk mengambil resume dari customer
const getResume = async (req, h) => {
    const id_user = req.params.id_user;

    try {
        // Mencari usee di database berdasarkan ID
        const user = await users.findOne({ where: { id: id_user } });

        if (!usee) {
            return h.response({ error: "User tidak ditemukan" }).code(404);
        }

        const resume = user.resume;

        return h.response(resume).code(200);
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        throw err;
    }
};

// Fungsi untuk mengambil batch yang tersedia
const getBatches = async (req, h) => {
    try {
        const page = req.query.page || 1;
        const per_page = req.query.per_page || 10;

        const batches = await Batch.findAll({
            where: { status: "open" },
            limit: per_page,
            offset: (page - 1) * per_page,
        });

        return h.response(batches).code(200);
    } catch (err) {
        console.error("Terjadi kesalahan:", err);
        throw err;
    }
};

// Fungsi untuk mengambil informasi batch berdasarkan ID batch
const getBatch = async (req, h) => {
    try {
        const batchId = req.params.batchId;

        const batch = await Batch.findOne({
            where: { id: batchId },
        });

        if (!batch) {
            return h.response({ error: "Batch tidak ditemukan" }).code(404);
        }

        return h.response(batch).code(200);
    } catch (err) {
        console.error("Terjadi kesalahan:", err);
        throw err;
    }
};

// Fungsi untuk mengajukan lamaran ke suatu batch
const applyBatch = async (req, h) => {
    try {
        const key = 'Jobsterific102723'; // Ganti dengan kunci rahasia Anda
        const token = decryptData(req.headers["Authorization"], key);

        // Mencari customer berdasarkan token
        const customer = await users.findOne({
            where: { token },
        });

        if (!customer) {
            return h.response({ error: "Customer tidak valid" }).code(401);
        }

        // Mendapatkan ID batch dari parameter route
        const batchId = req.params.batchId;

        // Mencari batch berdasarkan ID
        const batch = await Batch.findOne({
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
        const applyment = await Applyment.create({
            customerid: customer.id,
            batchid: batch.id,
            status: "pending",
        });

        return h.response({ message: "Lamaran berhasil diajukan" }).code(201);
    } catch (err) {
        console.error("Terjadi kesalahan:", err);
        throw err;
    }
};

async updateApplyment(req, h) {
  // Mendapatkan ID customer dan ID applyment dari parameter path
  const id_customer = req.params.id_customer;
  const applyment_id = req.params.applyment_id;

  try {
    // Mencari applyment berdasarkan ID customer dan ID applyment
    const applyment = await Applyment.findOne({ where: { customerid: id_customer, id: applyment_id } });

    // Jika applyment tidak ditemukan, kirim respons 404
    if (!applyment) {
      return h.response({ error: "Applyment tidak ditemukan" }).code(404);
    }

    // Mengatur nilai applyment berdasarkan data payload dari request
    applyment.set(req.payload);

    // Menyimpan perubahan ke dalam database
    await applyment.save();

    // Mengembalikan respons sukses dengan data applyment yang diperbarui
    return h.response(applyment).code(200);
  } catch (err) {
    // Menangani kesalahan dan mengembalikan respons kesalahan
    console.error('Terjadi kesalahan:', err);
    throw err;
  }
};

async deleteApplyment(req, h) {
  // Mendapatkan ID customer dan ID applyment dari parameter path
  const id_customer = req.params.id_customer;
  const applyment_id = req.params.applyment_id;

  try {
    // Mencari applyment berdasarkan ID customer dan ID applyment
    const applyment = await Applyment.findOne({ where: { customerid: id_customer, id: applyment_id } });

    // Jika applyment tidak ditemukan, kirim respons 404
    if (!applyment) {
      return h.response({ error: "Applyment tidak ditemukan" }).code(404);
    }

    // Menghapus applyment dari database
    await applyment.remove();

    // Mengembalikan respons sukses setelah menghapus applyment
    return h.response({ message: "Applyment berhasil dihapus" }).code(200);
  } catch (err) {
    // Menangani kesalahan dan mengembalikan respons kesalahan
    console.error('Terjadi kesalahan:', err);
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

// Ekspor semua fungsi agar dapat digunakan di tempat lain
module.exports = {
    getCustomer,
    registerCustomer,
    loginCustomer,
    getCustomerById,
    updateCustomer,
    getResume,
    applyBatch,
    getBatches,
    getBatch,
    updateApplyment,
    deleteApplyment,
    customerLogout,
};

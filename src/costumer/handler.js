const { customers } = require('./handler');
const CryptoJS = require('crypto-js');

const encryptData = (data, key) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

const decryptData = (ciphertext, key) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Ambil data dari SQLite
const getCustomer = async () => {
  try {
    const customers = await users.findAll({
      where: { isCustomer: true },
      orderBy: {
        firstName: "asc",
      },
    });
    return customers;
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    throw err;
  }
};

//Mengubah fungsi `register` untuk menerima parameter `isCustomer` secara default
const registerCustomer = async (req, h) => {
  const {
    firstName,
    lastName,
    email,
    password,
    job,
    sex,
    address,
    website,
    description,
  } = req.body;

  try {
    //Mengubah parameter `isCustomer` menjadi `true` secara default
    const newCustomer = await users.create({
      firstName,
      lastName,
      email,
      password,
      job,
      sex,
      address,
      website,
      description,
      isCustomer: true,
    });

    //Validasi data
    if (!email.includes("@")) {
      return h.status(400).json({ error: "Email tidak valid" });
    }

    if (password.length < 8) {
      return h.status(400).json({ error: "Password harus lebih dari 8 karakter" });
    }

    //Mengembalikan data customer yang baru dibuat
    return newCustomer;
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    throw err;
  }
};

const loginCustomers = async (request, h) => {
    const {
        email, 
        password,
    } = request.payload;

    try {
        // Mencari user di database berdasarkan email dan password
        const customer = await users.findOne({
            where: {
                email: email,
                password: password,
            }
        });

        if (!customer) {
            return h.response({ message: 'Validation Error' }).code(400);
        }

        // Mengenkripsi data user
        const key = 'Jobsterific102723'; // Ganti dengan kunci rahasia Anda

        const encryptedData = encryptData({
            email: customer.email,
            password: customer.password,
            firstName: customer.firstName
        }, key);

        // Menyimpan token ke database
        customer.token = encryptedData;
        await customer.save();

        // Mengembalikan data terenkripsi
        return h.response({ message: `Success Login`, customer}).code(200);

    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        return h.response({ message: 'Validation Error' }).code(400);
    }
}

// Menambahkan fungsi `getCustomerById` untuk mengambil data customer berdasarkan ID
const getCustomerById = async (req, h) => {
  const token = request.headers['token'];
  const userId = req.params.id_customer;

  try {
    // Mendekripsi token untuk mendapatkan data pengguna
    const key = 'Jobsterific102723'; // Ganti dengan kunci rahasia Anda
    const customerData = decryptData(token, key);
    // Mencari user di database berdasarkan email dan password
    const customer = await users.findByPk(userId);

    if (!customer) {
      return h.status(404).json({ error: "Customer not found" });
    }

    return customer;
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    throw err;
  }
};


//Menambahkan fungsi `updateCustomer` untuk memperbarui data customer
const updateCustomer = async (req, h) => {
  const userId = req.params.id_customer;

  try {
    const customer = await users.findByPk(userId);

    if (!customer) {
      return h.status(404).json({ error: "Customer not found" });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      job,
      sex,
      address,
      website,
      description,
    } = req.body;

    customer.firstName = firstName;
    customer.lastName = lastName;
    customer.email = email;
    customer.password = password;
    customer.job = job;
    customer.sex = sex;
    customer.address = address;
    customer.website = website;
    customer.description = description;

    await customer.save();

    return customer;
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    throw err;
  }
};

// Menambahkan fungsi `getResume` untuk mengambil resume dari user
const getResume = async (req, h) => {
  const id_user = req.params.id_user;

  try {
    const user = await User.findOne({ where: { id: id_user } });

    if (!user) {
      return h.status(404).json({ error: "User tidak ditemukan" });
    }

    const resume = user.resume;

    return h.response(resume, 200);
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    throw err;
  }
};

  const customerLogout = (req, h) => {
  const token = request.headers['token'];

    try {
        const customer = await users.findOne({
            where: {
                token : token
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
        return h.response({ message: 'Validation Error', err}).code(400);
    }
}

module.exports = {
  getCustomer,
  registerCustomer,
  loginCustomer,
  getCustomerById,
  updateCustomer,
  getResume,
  customerLogout,
};

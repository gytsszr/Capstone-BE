const { customers } = require('./handler'); // Ganti dengan path yang benar ke file models/users.js

// Ambil data dari SQLite
const getCustomers = async () => {
  try {
    const customers = await User.findAll({
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
const register = async (req, h) => {
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
    const newCustomer = await User.create({
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

// Menambahkan fungsi `getCustomerById` untuk mengambil data customer berdasarkan ID
const getCustomerById = async (req, h) => {
  const userId = req.params.id_customer;

  try {
    const customer = await User.findByPk(userId);

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
    const customer = await User.findByPk(userId);

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

  const customerLogout = (req, h) => {
  req.logout();
  return h.response({ message: "Logout successful" }, 200);
};

module.exports = {
  getCustomers,
  register,
  getCustomerById,
  updateCustomer,
  customerLogout,
};

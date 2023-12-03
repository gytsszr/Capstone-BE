const { users, batchs, applyments } = require('../../models');
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
        const customerData = encryptData({
            email: customer.email,
            password: customer.password,
            firstName: customer.firstName
        }, key);

        // Menyimpan token ke database
        customer.token = customerData;
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
  // Get token from header
  const token = req.headers['token'];

  try {
    // Decrypt token
    const key = 'Jobsterific102723';
    const customerData = decryptData(token, key);

    // Find customer by email and check if customer is valid
    const customer = await users.findOne({
      where: {
        email: customerData.email,
        isCustomer: true,
      },
    });

    if (!customer && customer.email != customerData.email) {
            return h.response({ message: 'Validation Error' }).code(400);
        }

    return h.response({
      customer,
    }).code(200);
  } catch (err) {
    console.error('Error:', err.message);
    return h.response({ message: err.message || 'Internal server error' }).code(500);
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
      
    // Find customer based on token's email
    const customer = await users.findOne({
      where: {
        token: token,
      },
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

// Fungsi untuk membuat campaign
const createCampaign = async (req, h) => {
  // Extract token from request headers
  const token = req.headers['token'];

  // Extract campaign data from request payload
  const {
    campaignName,
    campaignDesc,
    campaignPeriod,
    campaignKeyword,
    status,
    startDate,
    endDate,
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
        email: customerData.email,
        isCustomer: true,
      },
    });

    // If customer not found, send 404 response
    if (!customer) {
      return h.response({ message: 'Customer not found' }).code(404);
    }

    // Create new campaign
    const batch = new Batch({
      campaignName,
      campaignDesc,
      campaignPeriod,
      campaignKeyword,
      status,
      startDate,
      endDate,
      userId: customer.userId,
      isCustomer: true,
    });

    // Save new campaign
    await batch.save();

    // Send successful create response with new campaign data
    return h.response({ message: 'Success Create', batch }).code(200);
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

// Fungsi untuk memperbarui data campaign yang ada
const updateCampaign = async (req, h) => {
  // Extract token from request headers
  const token = req.headers['token'];

  // Extract campaign ID from request path
  const batchId = req.params.batchId;

  // Extract campaign data from request payload
  const {
    campaignName,
    campaignDesc,
    campaignPeriod,
    campaignKeyword,
    status,
    startDate,
    endDate,
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
        email: customerData.email,
        isCustomer: true,
      },
    });

    // If customer not found, send 404 response
    if (!customer) {
      return h.response({ message: 'Customer not found' }).code(404);
    }

    // Find campaign based on batch ID
    const batch = await batch.findOne({
      where: {
        batchId: batchId,
        userId: customer.userId,
        isCustomer: true,
      },
    });

    // If campaign not found, send 404 response
    if (!batch) {
      return h.response({ message: 'Campaign not found' }).code(404);
    }

    // Update campaign data
    batch.campaignName = campaignName;
    batch.campaignDesc = campaignDesc;
    batch.campaignPeriod = campaignPeriod;
    batch.campaignKeyword = campaignKeyword;
    batch.status = status;
    batch.startDate = startDate;
    batch.endDate = endDate;

    // Save updated campaign
    await batch.save();

    // Send successful update response
    return h.response({ message: 'Success Update' }).code(200);
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

// Fungsi untuk menghapus campaign
const deleteCampaign = async (req, h) => {
  // Extract token from request headers
  const token = req.headers['token'];

  // Extract campaign ID from request path
  const batchId = req.params.batchId;

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
        email: customerData.email,
        isCustomer: true,
      },
    });

    // If customer not found, send 404 response
    if (!customer) {
      return h.response({ message: 'Customer not found' }).code(404);
    }

    // Find campaign based on batch ID
    const batch = await batch.findOne({
      where: {
        batchId: batchId,
        userId: customer.id,
        isCustomer: true,
      },
    });

    // If campaign not found, send 404 response
    if (!batch) {
      return h.response({ message: 'Batch not found' }).code(404);
    }

    // Delete campaign
    await batch.remove();

    // Send successful delete response
    return h.response({ message: 'Success Delete' }).code(200);
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

module.exports = {
    getCustomer,
    registerCustomer,
    loginCustomer,
    getCustomerById,
    updateCustomer,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    customerLogout,
};

const { users, applyments, batchs  } = require('../../models');
const CryptoJS = require("crypto-js");

const key = "Jobsterific102723"; // Ganti dengan kunci rahasia Anda

const encryptData = (data, key) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

const decryptData = (ciphertext, key) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
//////////////////////////////Bagian user admin//////////////////////////////
const getAdmin = async (request, h) => {
  try {
      // Validate token and check if the user is an admin
      const token = request.headers['token'];
      const key = 'Jobsterific102723';
      const userData = decryptData(token, key);

      const adminUser = await users.findOne({
          where: {
              email: userData.email,
              isAdmin: true, 
          },
      });

      if (!adminUser) {
          return h.response({ message: 'Validation Error' }).code(400);
      }
      const adminProfile = {
        userId: adminUser.userId,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        email: adminUser.email,
        sex: adminUser.sex,
        address: adminUser.address,
        website: adminUser.website,
        description: adminUser.description,
        phone: adminUser.phone,
        job: adminUser.job,
      };

      return h.response(adminProfile).code(200);
  } catch (err) {
      console.error('Terjadi kesalahan:', err);
      return h.response({ message: 'Validation Error', error: err.message }).code(400);
  }
};
const registerAdmin = async (req, h) => {
  const {
    firstName,
    lastName,
    email,
    password,
    sex,
    address,
    website,
    description,
    phone,
    job,
  } = req.payload;

  try {
    // Validate data
    if (!email.includes("@")) {
      return h.response({ error: "Email tidak valid" }).code(400);
    }

    if (password.length < 8) {
      return h.response({ error: "Password harus lebih dari 8 karakter" }).code(400);
    }

    // validate the admin token
    const token = req.headers['token'];
    const key = 'Jobsterific102723';
    const adminData = decryptData(token, key);

    const adminUser = await users.findOne({
      where: {
        email: adminData.email,
        isAdmin: true,
      },
    });

    if (!adminUser) {
      return h.response({ message: 'Validation Error' }).code(400);
    }

    // Create a new admin with isAdmin default as true
    const newAdmin = await users.create({
      firstName,
      lastName,
      email,
      password,
      sex,
      address,
      isAdmin: true,
      website,
      description,
      phone,
      job,
    });

    // Return the newly created admin data
    return h.response(newAdmin).code(201);
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    return h.response({ error: "Terjadi kesalahan internal server" }).code(500);
  }
};
const loginAdmin = async (request, h) => {
  const { email, password } = request.payload;

  try {
      // Ganti "users" dengan model atau tabel yang sesuai untuk admin
      const admin = await users.findOne({
          where: {
              email: email,
              password: password,
              isAdmin: true, // Menambahkan kondisi untuk memastikan user adalah admin
          }
      });

      if (!admin) {
          return h.response({ message: 'Validation Error' }).code(400);
      }

      const key = 'Jobsterific102723';
      const encryptedData = encryptData({
          email: admin.email,
          password: admin.password,
          firstName: admin.firstName
      }, key);

      admin.token = encryptedData;
      await admin.save();

      return h.response({ message: 'Success Admin Login', admin }).code(200);

  } catch (err) {
      console.error('Terjadi kesalahan:', err);
      return h.response({ message: 'Validation Error' }).code(400);
  }
};
const logoutAdmin = async (request, h) => {
  const token = request.headers['token'];

  try {
      // Mendekripsi token untuk mendapatkan informasi admin
      const key = 'Jobsterific102723';
      const adminData = decryptData(token, key);

      // Validasi admin
      const admin = await users.findOne({
          where: {
              email: adminData.email,
              isAdmin: true,
          },
      });

      if (!admin) {
          return h.response({ message: 'Validation Error' }).code(400);
      }

      // Logout admin
      admin.token = null;
      await admin.save();

      return h.response({ message: 'Success Logout Admin' }).code(200);
  } catch (err) {
      console.error('Terjadi kesalahan:', err);
      return h.response({ message: 'Validation Error' }).code(400);
  }
};

//////////////////////////////Bagian Applyment admin//////////////////////////////
const AdmingetApplyments = async (request, h) => {
  const token = request.headers['token'];
  try {
    // Validate token and check if the user is an admin
    const key = 'Jobsterific102723';
    const userData = decryptData(token, key);

    const user = await users.findOne({
      where: {
        email: userData.email,
        isAdmin: true,
      },
    });

    if (!user) {
      return h.response({ message: 'Validation Error' }).code(400);
    }

    // Get all applyments from the database
    const allApplyments = await applyments.findAll();

    return h.response({ applyments: allApplyments }).code(200);
  } catch (err) {
    console.error('Error:', err);
    return h.response({ message: 'Validation Error', error: err.message }).code(400);
  }
};
const AdminDeleteApplyment = async (request, h) => {
  const token = request.headers['token'];

  try {
    // Validate token and check if the user is an admin
    const key = 'Jobsterific102723';
    const userData = decryptData(token, key);

    const user = await users.findOne({
      where: {
        email: userData.email,
        isAdmin: true,
      },
    });

    if (!user) {
      return h.response({ message: 'Validation Error' }).code(400);
    }

    // Get applyId from the request parameters
    const applyId = request.params.applyId;

    // Find the applyment based on applyId
    const applymentToDelete = await applyments.findOne({
      where: { applyId: applyId },
    });

    if (!applymentToDelete) {
      return h.response({ message: 'Applyment not found' }).code(404);
    }

    // Delete the applyment
    await applymentToDelete.destroy();

    return h.response({ message: 'Success Delete Applyment', deletedApplymentId: applyId }).code(200);
  } catch (err) {
    console.error('Error:', err);
    return h.response({ message: 'Validation Error', error: err.message }).code(400);
  }
};
const AdminUpdateApplyment = async (request, h) => {
  const token = request.headers['token'];

  try {
    // Validate token and check if the user is an admin
    const key = 'Jobsterific102723';
    const userData = decryptData(token, key);

    const user = await users.findOne({
      where: {
        email: userData.email,
        isAdmin: true,
      },
    });

    if (!user) {
      return h.response({ message: 'Validation Error' }).code(400);
    }

    // Get applyId from the request parameters
    const applyId = request.params.applyId;

    // Find the applyment based on applyId
    const applymentToUpdate = await applyments.findOne({
      where: { applyId: applyId },
    });

    if (!applymentToUpdate) {
      return h.response({ message: 'Applyment not found' }).code(404);
    }

    // Get data for updating from the request payload
    const {
      userId,
      batchId,
      status
    } = request.payload;

    // Update applyment data
    applymentToUpdate.userId = userId;
    applymentToUpdate.batchId = batchId;
    applymentToUpdate.status = status;

    await applymentToUpdate.save();

    return h.response({ message: 'Success Update Applyment', updatedApplyment: applymentToUpdate }).code(200);
  } catch (err) {
    console.error('Error:', err);
    return h.response({ message: 'Validation Error', error: err.message }).code(400);
  }
};

///////////////////////////////BATCH//////////////////////////////////////////
const AdminGetBatch = async (request, h) => {
  const token = request.headers['token'];

  try {
    // Validate token and check if the user is an admin
    const key = 'Jobsterific102723';
    const userData = decryptData(token, key);

    const user = await users.findOne({
      where: {
        email: userData.email,
        isAdmin: true,
      },
    });

    if (!user) {
      return h.response({ message: 'Validation Error' }).code(400);
    }

    // If validation is successful, get all batches
    const batches = await batchs.findAll();

    return h.response({ batches }).code(200);
  } catch (err) {
    console.error('Error:', err);
    return h.response({ message: 'Validation Error', error: err.message }).code(400);
  }
};
const AdminUpdateBatch = async (request, h) => {
  const token = request.headers['token']; // Token dari admin
  const key = 'Jobsterific102723';

  try {
    // Menggunakan token untuk mendapatkan informasi admin
    const adminData = decryptData(token, key);

    // Memastikan bahwa user dengan token tersebut adalah admin
    const admin = await users.findOne({
      where: {
        email: adminData.email,
        isAdmin: true,
      },
    });

    if (!admin) {
      return h.response({ message: 'Unauthorized' }).code(401);
    }

    const batchId = request.params.batchId;
    const {
      campaignName,
      campaignDesc,
      campaignPeriod,
      campaignKeyword,
      startDate,
      endDate,
      status, // Include the status field
    } = request.payload;

    const existingBatch = await batchs.findOne({
      where: {
        BatchId: batchId,
      },
    });

    if (!existingBatch) {
      return h.response({ message: 'Batch not found' }).code(404);
    }

    // Memastikan bahwa batch yang akan diupdate dibuat oleh admin yang sedang login
    if (existingBatch.UserId !== admin.UserId) {
      return h.response({ message: 'Unauthorized' }).code(401);
    }

    // Melakukan update atribut batch
    existingBatch.campaignName = campaignName;
    existingBatch.campaignDesc = campaignDesc;
    existingBatch.campaignPeriod = campaignPeriod;
    existingBatch.campaignKeyword = campaignKeyword;
    existingBatch.startDate = startDate;
    existingBatch.endDate = endDate;
    existingBatch.status = status; // Update the status field

    // Set userId to the admin's UserId
    existingBatch.UserId = admin.UserId;

    await existingBatch.save();

    return h.response({ message: 'Success Update Batch', updatedBatch: existingBatch }).code(200);

  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    return h.response({ message: 'Validation Error' }).code(400);
  }
};

const AdminDeleteBatch = async (request, h) => {
  const token = request.headers['token'];
  const batchId = request.params.batchId; // Get batchId from URL parameters

  try {
    // Validate token and check if the user is an admin
    const key = 'Jobsterific102723';
    const userData = decryptData(token, key);

    const adminUser = await users.findOne({
      where: {
        email: userData.email,
        isAdmin: true,
      },
    });

    if (!adminUser) {
      return h.response({ message: 'Validation Error' }).code(400);
    }

    // Delete batch based on batchId
    const deletedBatch = await batchs.destroy({
      where: {
        batchId: batchId,
      },
    });

    if (!deletedBatch) {
      return h.response({ message: 'Batch not found' }).code(404);
    }

    return h.response({ message: 'Success Delete Batch', deletedBatchId: batchId }).code(200);
  } catch (err) {
    console.error('Error:', err);
    return h.response({ message: 'Validation Error', err }).code(400);
  }
};

//////////////////////////////Bagian candicate/user//////////////////////////////
// Endpoint GET /api/admins/candidates (Get All Candidates)

const AdmingetCandidates = async (request, h) => {
  const token = request.headers['token'];

  try {
    // Validate token and check if the user is an admin
    const key = 'Jobsterific102723';
    const userData = decryptData(token, key);

    const user = await users.findOne({
      where: {
        email: userData.email,
        isAdmin: true,
      },
    });

    if (!user) {
      return h.response({ message: 'Validation Error' }).code(400);
    }

    // If validation is successful, get all candidates
    const candidates = await users.findAll({
      where: { isCustomer: false, isAdmin: false},
    });

    return h.response({ candidates }).code(200);
  } catch (err) {
    console.error('Error:', err);
    return h.response({ message: 'Validation Error', error: err.message }).code(400);
  }
};
const AdminupdateCandidatePassword = async (request, h) => {
  try {
    const token = request.headers['token']; // Admin token
    const key = 'Jobsterific102723';

    // Validate admin token and get admin information
    const adminData = decryptData(token, key);
    const admin = await users.findOne({
      where: { email: adminData.email, isAdmin: true },
    });

    if (!admin) {
      return h.response({ message: 'Unauthorized' }).code(401);
    }

    const candidateId = request.params.candidateId;
    const { password } = request.payload;

    // Validate password
    if (password.length < 6) {
      return h.response({ message: 'Password must be at least 6 characters' }).code(400);
    }

    // Update candidate's password
    await users.update({ password }, { where: { userId: candidateId, isCustomer: false, isAdmin: false } });

    return h.response({ message: 'Candidate password updated successfully' }).code(200);
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    return h.response({ message: 'Validation Error' }).code(400);
  }
};
const AdmindeleteCandidate = async (request, h) => {
  try {
    const token = request.headers['token']; // Admin token
    const key = 'Jobsterific102723';

    // Validate admin token and get admin information
    const adminData = decryptData(token, key);
    const admin = await users.findOne({
      where: { email: adminData.email, isAdmin: true },
    });

    if (!admin) {
      return h.response({ message: 'Unauthorized' }).code(401);
    }

    const candidateId = request.params.candidateId;

    // Delete candidate based on ID
    const deletedCandidate = await users.destroy({
      where: { userId: candidateId, isCustomer: false, isAdmin: false },
    });

    if (!deletedCandidate) {
      return h.response({ message: 'Candidate not found' }).code(404);
    }

    return h.response({ message: 'Candidate successfully deleted', deletedCandidateId: candidateId }).code(200);
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    return h.response({ message: 'Validation Error' }).code(400);
  }
};

/////////////////////////////////////////Costumer di Admin///////////////////////////////////////////////////////

const AdmingetCustomers = async (request, h) => {
  const token = request.headers['token'];

  try {
      // Validasi token dan periksa apakah pengguna adalah admin
      const key = 'Jobsterific102723';
      const userData = decryptData(token, key);

      const user = await users.findOne({
          where: {
              email: userData.email,
              isAdmin: true, // Pastikan pengguna adalah admin
          }
      });

      if (!user) {
          return h.response({ message: 'Validation Error' }).code(400);
      }

      // Jika validasi berhasil, dapatkan semua customer (pengguna yang merupakan costumer)
      const customersData = await users.findAll({
          where: { isCustomer: true },
          order: [
              ['firstName', 'ASC'],
          ],
      });

      return h.response({ customersData }).code(200);

  } catch (err) {
      console.error('Terjadi kesalahan:', err);
      return h.response({ message: 'Validation Error', err }).code(400);
  }
};
const AdminupdateCustomer = async (request, h) => {
  const token = request.headers['token'];
  const id_customer = request.params.customerId; // Mengambil id_customer dari parameter URL

  try {
      // Validasi token dan periksa apakah pengguna adalah admin
      const key = 'Jobsterific102723';
      const userData = decryptData(token, key);

      const adminUser = await users.findOne({
          where: {
              email: userData.email,
              isAdmin: true,
          }
      });

      if (!adminUser) {
          return h.response({ message: 'Validation Error' }).code(400);
      }

      // Pastikan data customer yang ingin diupdate ada
      const customerToUpdate = await users.findOne({
          where: {
              userId: id_customer,
              isCustomer: true, // Pastikan yang diupdate adalah customer
          }
      });

      if (!customerToUpdate) {
          return h.response({ message: 'Customer not found' }).code(404);
      }

      // Mendapatkan data baru dari payload
      const {
          firstName,
          lastName,
          email,
          password,
          job,
          sex,
          address,
          Website,
          Description,
          phone,
      } = request.payload;

      // Melakukan update pada data customer
      customerToUpdate.firstName = firstName;
      customerToUpdate.lastName = lastName;
      customerToUpdate.email = email;
      customerToUpdate.password = password;
      customerToUpdate.job = job;
      customerToUpdate.sex = sex;
      customerToUpdate.address = address;
      customerToUpdate.Website = Website;
      customerToUpdate.Description = Description;
      customerToUpdate.phone = phone;

      await customerToUpdate.save();

      return h.response({ message: 'Success Update Customer', customerToUpdate }).code(200);
  } catch (err) {
      console.error('Terjadi kesalahan:', err);
      return h.response({ message: 'Validation Error', err }).code(400);
  }
};
const AdmindeleteCustomer = async (request, h) => {
  const token = request.headers['token'];
  const customerId = request.params.customerId; // Mengambil ID customer dari URL

  try {
      // Validasi token dan periksa apakah pengguna adalah admin
      const key = 'Jobsterific102723';
      const userData = decryptData(token, key);

      const user = await users.findOne({
          where: {
              email: userData.email,
              isAdmin: true, // Pastikan pengguna adalah admin
          }
      });

      if (!user) {
          return h.response({ message: 'Validation Error' }).code(400);
      }

    
      const deletedCustomer = await users.destroy({
          where: {
              userId: customerId,
              isCustomer: true, 
          }
      });

      if (!deletedCustomer) {
          return h.response({ message: 'Customer not found' }).code(404);
      }

      return h.response({ message: 'Success Delete Customer', deletedCustomerId: customerId }).code(200);
  } catch (err) {
      console.error('Terjadi kesalahan:', err);
      return h.response({ message: 'Validation Error', err }).code(400);
  }
};

module.exports = {
  getAdmin,  registerAdmin,  loginAdmin,  logoutAdmin,
  AdminGetBatch,  AdminUpdateBatch,  AdminDeleteBatch,
  AdmingetApplyments,  AdminUpdateApplyment,  AdminDeleteApplyment,
  AdmingetCustomers,  AdminupdateCustomer,  AdmindeleteCustomer,
  AdmingetCandidates,  AdmindeleteCandidate,  AdminupdateCandidatePassword,
  
};

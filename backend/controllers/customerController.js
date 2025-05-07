import Customer from "../models/customerModel.js";

export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, location, joinedDate, profileImage } = req.body;

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res
        .status(400)
        .json({ success: false, message: "Customer already exists!" });
    }

    const newCustomer = new Customer({
      name,
      email,
      phone,
      location,
      joinedDate,
      profileImage,
    });

    await newCustomer.save();
    res.status(201).json({ success: true, customer: newCustomer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found!" });
    }
    res.status(200).json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCustomer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found!" });
    }

    res.status(200).json({ success: true, customer: updatedCustomer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found!" });
    }

    res
      .status(200)
      .json({ success: true, message: "Customer deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const pool = require("../config/db");

const getAllUsers = async () => {
  const query = `SELECT * FROM users`;

  try {
    const [rows] = await pool.query(query);
    return rows.map((user) => ({
      ...user,
    }));
  } catch (err) {
    throw new Error("Failed to fetch users");
  }
};

const updateUserStatus = async (id, status) => {
  const query = `UPDATE users SET status = ? WHERE id = ?`;

  try {
    const [result] = await pool.query(query, [status, id]);
    return result;
  } catch (err) {
    throw new Error("Failed to update user status");
  }
};

const getUsersCount = async () => {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM users");
  return rows[0].count;
};
module.exports = {
  getAllUsers,
  updateUserStatus,
  getUsersCount,
};

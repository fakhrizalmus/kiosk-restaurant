const {User} = require("../models")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, nik, password } = req.body;
  const userData = {
    name: name,
    nik: nik,
    password: password
  }

  const foundNik = await User.findOne({
    where: {
      nik: req.body.nik
    }
  })

  if (foundNik) {
    return res.status(400).json({
      message: 'Nik sudah terpakai!'
    })
  } else {
    const addUser = await User.create(userData)
    return res.status(201).json({
      data: {
        name: name,
        nik: nik,
        password: addUser.password
      }
    })
  }
}

const login = async (req, res) => {
  const { nik, password } = req.body

  const foundUser = await User.findOne({ where: { nik } });
  if (!foundUser) {
    return res.status(400).json({ message: "Nik atau password salah!" });
  }
  const validasi = bcrypt.compareSync(password, foundUser.password);

  if (!validasi) {
    return res.status(400).json({ message: "Nik atau password salah!" });
  }

  // Simpan user ke session
  req.session.userId = foundUser.id;

  return res.status(200).json({
    message: "Login berhasil",
    sessionId: req.sessionID,
  });
}

const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid"); // hapus cookie
    res.json({ message: "Logout berhasil" });
  });
};

const infoLogin = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Belum login" });
  }

  const user = await User.findOne({
    where: { id: req.session.userId },
  });

  return res.status(200).json({ data: user });
};

module.exports = {
  register,
  login,
  logout,
  infoLogin
}
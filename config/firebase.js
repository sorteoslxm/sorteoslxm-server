import admin from "firebase-admin";

// 🔹 JSON de credenciales de Firebase directo en el código
const serviceAccount = {
  "type": "service_account",
  "project_id": "sorteoslxm",
  "private_key_id": "b1ec685410842cb4c58a327e617e43f9288ba910",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCxJed6d8A/71vT\nFEsIVXNGkkqMWhzSNKA01HRId7jtn8dyHaW38Ax1W6lqDFsma9X1BllTzHEz1X/Z\nf+2DjdxJETQfxeG32nd+q8q+wrFfQIbt1YKZ/DC/DsQHITGjKT0N0eQhCrqUek2N\nAoWsi/2ngvgvrtvV2Q8zfgne2+uPlSxCM7he8pNBF5dZZbJ67W1MJk1E4a1KSjqA\nsvORzNsjahgMbQk+yOpP8bO5TOqBm/ZTM0bDXriplBHfAJyazYZ2oQHS+uRAUXZm\nk57E/WXTnO1qcCcFDBbZe73mZU9yapF1G9v4A9s8binYv7qqayuLAHmQG0o9/xnW\nOeg9qPZRAgMBAAECggEACTmhbpF7PKA62ijzC8yAR2s3w/Z2RVM3X0HS3/iRc+50\n2HljqTyFqZGTGIskLrOW6+ltnlY3phBFHQ7zFwugLnbPVPoHxO5msOC0DOFQduT0\nBWwFAnC/N1dxgl2KYm1CA8zkmxk6mbxmiQgEl9kQrP8wJYf9K6f8UHKa9W3i5vXd\nELs0j7cAR3GD/rd9aDFvDnEG59kwPwK3gpz9GkSXqAP5uiq2FtVZFqkuH26jPv5y\nAe8IYgB5j9347Sv6BupZkH3SjekVaGcf+q3nxAsr5ctCWBaZpxYqCU1LM6PuZw/N\n6tgT9JID0UbtB27zfIhaCh1u5PaRqXtifpPE89NvsQKBgQD57q3kdXMU3QWl1fis\nE0pp4jaIqvn804F3jgdo/AUyzaHHmd/UxXkukHzOjz9fLpji2gMr/05IUkNy4guI\nhZwtuDogpD/Wbw240xaoPZpQpi5Y03p54GaCCtgR8wbFCf6I/Eqf6fuWw9FgIy16\nRKQBOLthglhG12d+fMUu4kZ+KwKBgQC1ct+K4jJRRLK02s8pbuQtmGcut01DGfu2\nYT8/oY3n3UteBZrBE4pYzQ4ObHifvOYhaddaQ2IVCXCQ0S8UVSO1ed9M2ZSABVTY\n8cJSbZA58XQ8yzqfFNvFUfktqgZXtczFsqzabUN6uzcik8S0r0y5HyLY3aVQAcRq\nGItcve9bcwKBgQCQXyhB3PpyJc5aYkR4GdiVW1/HCITJX9/ckMWFBnd2RkRaiW87\neCqtFDeUFjk0ITWdbPQCGUM+EY72sM6auRtjaZTiQB7EHnhduEnRO2yFg8kn9Fk+\nR7rPCbaQf8L8VO6ccKgmwcFb8Jdkok1l4HqgXgYXqHSXz1vwO+CnWXwA6wKBgQCP\nq6l9GqWk27R0p1yo/fkGcUoiH1m56/T28AFYrN7j3ME0bVOf1Y0Ryyt6GEFamgPO\nKTQvcHNVHOhYgom4m8FujFVXUGDZDV+ld6faBI7SknDrQi/kjmuFzeZzVdE32eeO\nEm/zc9iecWaypjZ2quchHZpGBRpEQ2H2cADJKktAKQKBgQDzJrABw0DkwVO56+uh\nnRlIyj38BlFMRTO6fAdAALjvW7vXMChBCm/CO6B0SXSQwqTNS4Xl3ctzqEkdj+pU\nAqrUFPYp7x8qKp600yHAKowi6VO29NitTcgAfJYb8XgP5MRgc/PHKW7hbFfxzSaB\nFei7dQnLPlxN4mbfqDEokK42+g==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@sorteoslxm.iam.gserviceaccount.com",
  "client_id": "115326641099621688409",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40sorteoslxm.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export { db };
